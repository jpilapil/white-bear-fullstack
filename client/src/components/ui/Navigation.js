import React from "react";
import { Link } from "react-router-dom";

export default function Navigation() {
  const url = window.location.pathname;
  function tabActiveOnCreate(url) {
    if (url.indexOf("create-imagery") > 0 || url.indexOf("create-answer") > 0) {
      return "tab-active";
    } else return "";
  }

  function tabActiveOnReviw(url) {
    if (
      url.indexOf("review-imagery") > 0 ||
      url.indexOf("review-answer") > 0 ||
      url.indexOf("review-empty") > 0
    ) {
      return "tab-active";
    } else return "";
  }

  function tabActiveOnAllCards(url) {
    if (url.indexOf("all-cards") > 0) {
      return "tab-active";
    } else return "";
  }

  return (
    <div
      className="btn-group d-flex "
      role="navigation"
      aria-label="navigation"
    >
      <Link
        to="/create-answer"
        // type="button"
        className={`btn btn-secondary navigation-button tab-separator ${tabActiveOnCreate(
          url
        )}`}
      >
        Create new
      </Link>
      <Link
        to="/review-imagery"
        // type="button"
        className={`btn btn-secondary navigation-button tab-separator ${tabActiveOnReviw(
          url
        )}`}
      >
        Review
      </Link>
      <Link
        to="/all-cards"
        // type="button"
        className={`btn btn-secondary navigation-button tab-separator ${tabActiveOnAllCards(
          url
        )}`}
      >
        All cards
      </Link>
    </div>
  );
}
