# STOON User Space Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a complete STOON account area for publications, profiles, messages, reviews, and author contact without changing the database schema.

**Architecture:** Reuse existing REST resources and MySQL models. Add one authenticated aggregation endpoint for the current user's publications, then build focused vanilla JavaScript pages consuming the API.

**Tech Stack:** HTML, CSS, Bootstrap, vanilla JavaScript modules, Node.js, Express, Sequelize, MySQL, Python chatbot.

---

### Task 1: Current User Publications API

**Files:**
- Modify: `backend/controllers/userController.js`
- Modify: `backend/routes/userRoutes.js`
- Test: `backend/controllers/myPublications.test.js`

- [ ] Write a failing integration test for `GET /api/users/me/publications`.
- [ ] Add the authenticated route and aggregate the current user's resources.
- [ ] Run the API test and existing backend tests.

### Task 2: Shared Account Navigation And Dashboard

**Files:**
- Create: `frontend/js/account.js`
- Modify: `frontend/index.html`
- Modify: `frontend/js/site.js`
- Modify: `frontend/pages/dashboard.html`
- Modify: `frontend/js/dashboard.js`
- Modify: `frontend/css/app.css`

- [ ] Remove the duplicate account action.
- [ ] Add reusable account navigation and dashboard statistics.
- [ ] Verify authenticated and anonymous navigation.

### Task 3: Publishing And Publication Management

**Files:**
- Create: `frontend/pages/publish.html`
- Create: `frontend/pages/my-publications.html`
- Create: `frontend/js/publish.js`
- Create: `frontend/js/my-publications.js`
- Modify: `frontend/css/app.css`

- [ ] Add type-specific publishing forms using current API contracts.
- [ ] Add current-user publication list and ownership deletion.
- [ ] Verify validation and rendering without changing the schema.

### Task 4: Editable And Public Profiles

**Files:**
- Create: `frontend/pages/profile.html`
- Create: `frontend/pages/user.html`
- Create: `frontend/js/profile.js`
- Create: `frontend/js/user-profile.js`
- Modify: `frontend/css/app.css`

- [ ] Build authenticated profile editing.
- [ ] Build public author profile and review form.
- [ ] Verify profile and review API behavior.

### Task 5: Messaging And Listing Actions

**Files:**
- Create: `frontend/pages/messages.html`
- Create: `frontend/js/messages.js`
- Modify: `frontend/js/listings.js`
- Modify: `frontend/js/listingPresentation.js`
- Modify: `frontend/css/app.css`

- [ ] Show author and contact actions on listings.
- [ ] Start and continue private conversations.
- [ ] Verify author contact and message flows.

### Task 6: Full Verification And Publication

**Files:**
- Modify tests as required.

- [ ] Run syntax, unit, API, link, desktop, and mobile checks.
- [ ] Commit the complete change.
- [ ] Replace the old GitHub STOON version with the verified version.
