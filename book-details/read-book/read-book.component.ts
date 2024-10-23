import { AccountService } from './../../services/account.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Book } from 'src/app/models/book.model';
import { Comment } from 'src/app/models/comment.model';
import { AuthService } from 'src/app/services/auth.service';
import { BookService } from 'src/app/services/book.service';
import { CommentService } from 'src/app/services/comment.service';

@Component({
  selector: 'app-read-book',
  templateUrl: './read-book.component.html',
  styleUrls: ['./read-book.component.css'],
})
export class ReadBookComponent implements OnInit {
  book: Book;
  comments: Comment[] = [];
  text: string = '';
  comment: Comment;
  userName: string;

  constructor(
    private location: Location,
    private route: ActivatedRoute,
    private bookService: BookService,
    private authService: AuthService,
    private commentService: CommentService,
    private accountService: AccountService
  ) {}

  ngOnInit(): void {
    const bookId = +this.route.snapshot.paramMap.get('bookId')!;
    this.loadBookDetails(bookId);
    this.loadComments(bookId);
  }

  loadBookDetails(bookId: number): void {
    this.bookService.getBookById(bookId).subscribe((book) => {
      this.book = book;
    });
  }

  loadComments(bookId: number): void {
    this.commentService.getComments().subscribe((comments) => {
      this.comments = comments.filter((comment) => comment.bookId === bookId);
    });
  }

  commentBook(): void {
    if (this.text.trim() === '') {
      return; // Handle empty comment if desired
    }

    const newComment: Comment = {
      commentId: 0, // This will be assigned by the server
      bookId: this.book.bookId,
      userId: this.authService.getUserId(),
      text: this.text,
      createdDate: new Date(),
    };

    this.commentService.createComment(newComment).subscribe(
      (createdComment: Comment) => {
        // Assuming the server returns the created comment
        this.loadComments(this.book.bookId); // Reload comments after posting new comment
        this.text = ''; // Clear comment input

        // Load the username for the newly created comment
        this.loadUserName(createdComment.userId);
      },
      (error) => {
        console.error('Failed to create comment:', error);
      }
    );
  }

  loadUserName(userId: number): void {
    this.accountService.getUserNameById(userId).subscribe(
      (userName: string) => {
        this.userName = userName;
        // You might want to update the comment object or comments array with this username
        // For example:
        // this.updateCommentWithUserName(userId, userName);
      },
      (error) => {
        console.error('Failed to load userName:', error);
      }
    );
  }

  // Optional: Update the comment with the username
  updateCommentWithUserName(userId: number, userName: string): void {
    const commentIndex = this.comments.findIndex(
      (comment) => comment.userId === userId
    );
    if (commentIndex !== -1) {
      this.comments[commentIndex].userName = userName;
    }
  }

  addComment(): void {
    if (this.text.trim() === '') {
      return; // Handle empty comment if desired
    }

    this.comment = new Comment();
    this.comment.bookId = this.book.bookId;
    this.comment.userId = this.authService.getUserId();
    this.comment.text = this.text.trim();
    this.comment.createdDate = new Date();

    this.commentService.createComment(this.comment).subscribe(() => {
      this.loadComments(this.book.bookId); // Reload comments after posting new comment
      this.text = ''; // Clear comment input
    });
  }

  navigateBack(): void {
    this.location.back();
  }
}
