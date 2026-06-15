# STOON User Space Design

## Goal

Transform the existing dashboard into a complete student account area inspired by
`stoon.free.nf`, while keeping the current HTML, CSS, Bootstrap, vanilla
JavaScript, Node.js, Python chatbot, and MySQL schema unchanged.

## Navigation

The public header displays a single authentication action. Anonymous visitors see
`Connexion`; authenticated users see `Mon espace`. The duplicate button is
removed. Internal account pages share a compact navigation linking to the
dashboard, publications, publishing, profile, messages, and logout.

## Account Area

The dashboard summarizes the authenticated user's profile and existing API
statistics. It exposes direct actions for publishing an offer, managing
publications, editing the profile, and opening messages.

## Publications

Authenticated users can publish housing, rides, jobs, and documents through a
single page with a type selector and type-specific forms. Existing API routes and
validators are reused. Users can list and delete their own publications. The
database schema is not changed.

## Profiles And Reviews

The profile page uses the existing `/api/auth/me`, `/api/users/profile`, and
`/api/reviews` routes. Users can edit their account information. Public author
profiles display identity, studies, reputation, and reviews. Reviews are used as
public comments about an author because publication-level comments would require
a new database table.

## Messaging

Listing cards expose the publication author and a contact action. Authenticated
users can start a private conversation with an author and continue it from a
messages page using the existing conversations and messages tables.

## Error Handling And Security

Account pages redirect anonymous visitors to login. Forms display server
validation messages without exposing technical details. Existing ownership
checks protect updates and deletion. No database migration or schema sync is run.

## Verification

Automated tests cover my-publications aggregation and frontend helpers. Browser
verification covers authentication, publishing forms without final destructive
submission, profile editing UI, author contact, messaging, reviews, navigation,
and desktop/mobile responsive behavior.
