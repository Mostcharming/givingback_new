# GivingBack ERP - User Journey & Flow Documentation

## Overview

This document details the complete user stories and workflows for both Donors and NGOs in the GivingBack ERP platform.

---

## 📊 DONOR USER STORY & WORKFLOW

### 1. **Registration & Account Setup**

- **Action**: Donor signs up as either Individual or Corporate donor
- **Output**: Account created after filling basic information
- **Next**: Access donor dashboard and core features

### 2. **Initial Choices**

Donors have two options:

- **Create Own NGO**: Register an NGO profile on the platform
- **Interact with Existing NGOs**: Browse and work with already registered NGOs

### 3. **Create Brief/Project**

A brief is the initial project posting that can be in draft or active state.

**Brief Details Include:**

- Project name, description, and scope
- Budget allocation
- Timeline and deliverables

### 4. **Set Visibility Rules**

Donors control who sees their brief:

| Visibility Type   | Details                                                                     |
| ----------------- | --------------------------------------------------------------------------- |
| **Private**       | Select specific NGOs to view the brief                                      |
| **Public**        | Available to all registered NGOs on platform                                |
| **Selected Area** | Targeted to NGOs in specific geographic regions; they receive notifications |

### 5. **Budget Management**

- **Requirement**: Wallet must have sufficient funds for brief budget
- **If Insufficient**: Donor can fund wallet via:
  - **International Payments**: Stripe integration
  - **Local Payments**: Paystack integration
- **Activation**: Only after wallet is funded can brief go active

### 6. **Draft vs. Active State**

- **Draft**: Saved but not published; NGOs cannot see or apply
- **Active**: Published; NGOs receive notifications (if applicable) and can apply

### 7. **Milestone Creation**

After brief activation, donor creates project milestones:

- Define milestone deliverables
- Set specific targets for each milestone
- Set deadline for each milestone
- Each milestone represents a payment tranche

### 8. **Receive & Review Applications**

- NGOs see notifications and apply for the brief
- Donor reviews NGO applications with:
  - Proposal details
  - Team expertise
  - Implementation plan
- **Donor Action**: Approve or Reject each application

### 9. **Project Activation**

Once NGO is selected:

- **30% Budget Release**: NGO receives 30% of total budget for mobilization and initial work
- **Project Status**: Moves to "Active" and work begins

### 10. **Monitor Milestone Completion**

- NGO submits updates for each milestone
- NGO uploads evidence (images/documentation)
- NGO updates target amount covered
- Donor verifies completeness and approves/requests revisions

### 11. **Payment Tranches**

- Each verified milestone triggers next payment release
- Process repeats until all milestones completed
- Final project report generated

---

## � MESSAGING & COLLABORATION FEATURE

### Overview

The messaging feature enables real-time communication between Donors and NGOs throughout the project lifecycle, fostering transparency and resolving issues quickly.

### For Donors - When They Can Message NGOs

**1. During Application Review**

- **Purpose**: Ask clarifying questions about NGO proposals
- **Benefits**: Better understand implementation approach before approval
- **Outcome**: Informed decision-making with direct dialogue

**2. After Approval - Pre-Project Start**

- **Purpose**: Discuss project expectations, timeline, and specific requirements
- **Benefits**: Align on project goals and mobilization strategy
- **Outcome**: NGO fully prepared for 30% budget and project launch

**3. During Project Execution**

- **Purpose**: Monitor progress, ask for status updates, request clarification
- **Benefits**: Real-time communication prevents delays and misunderstandings
- **Outcome**: Smooth project progression

**4. During Milestone Review**

- **Purpose**: Request revisions, ask for additional documentation, or clarify issues
- **Benefits**: Collaborative problem-solving before milestone rejection
- **Outcome**: Higher milestone completion rates with quality assurance

### For NGOs - When They Can Message Donors

**1. During Application Pending Period**

- **Purpose**: Ask questions about the brief, clarify requirements, address concerns
- **Benefits**: Better understand expectations and increase approval chances
- **Outcome**: More informed and competitive applications

**2. When Rejected**

- **Purpose**: Request feedback and understand reasons for rejection
- **Benefits**: Learn improvement areas for future applications
- **Outcome**: Better performance on subsequent opportunities

**3. After Approval - Pre-Project Start**

- **Purpose**: Discuss project start date, mobilization planning, and team assignments
- **Benefits**: Smooth transition into active project phase
- **Outcome**: Well-coordinated project kickoff

**4. During Milestone Updates - If Needing Clarification**

- **Purpose**: Understand revision requirements or ask for deadline extensions
- **Benefits**: Ensure proper understanding of expectations
- **Outcome**: Accurate and complete milestone submissions

### Key Messaging Benefits

| Benefit                    | Impact                             |
| -------------------------- | ---------------------------------- |
| **Real-time Dialogue**     | Reduces back-and-forth delays      |
| **Direct Communication**   | Prevents misunderstandings         |
| **Project Transparency**   | Both parties stay aligned          |
| **Quick Issue Resolution** | Problems solved before escalation  |
| **Relationship Building**  | Stronger donor-NGO partnerships    |
| **Quality Improvement**    | More effective milestone execution |
| **Trust Development**      | Both parties feel heard and valued |

### Messaging Best Practices

**For Donors:**

- Use messaging to clarify, not to micromanage
- Provide detailed feedback in milestone review messages
- Respond promptly to NGO questions
- Document important decisions in messages for reference

**For NGOs:**

- Ask specific questions, not generic ones
- Be professional and courteous in all communication
- Provide context when requesting clarity
- Follow up on agreements discussed in messages

---

## �📊 NGO USER STORY & WORKFLOW

### 1. **Registration & Verification**

- **Action**: NGO signs up with organization details
- **KYC Process**: Complete Know Your Customer verification
- **Approval**: Account activated once KYC approved
- **Outcome**: Access NGO dashboard

### 2. **Opportunity Discovery**

NGOs discover briefs through:

- **Notifications**: Real-time alerts for matching opportunities
- **Dashboard Browse**: Search available briefs matching their profile
- **Filter Options**: By sector, location, budget, timeline

### 3. **Evaluate Brief**

NGO reviews complete brief information:

- Project scope and objectives
- Budget amount and payment structure
- Milestone details and deadlines
- Required deliverables
- Visibility/selection criteria

### 4. **Submit Application**

If interested, NGO prepares and submits application including:

- **Proposal**: Detailed response to project requirements
- **Implementation Plan**: Step-by-step execution strategy
- **Team Expertise**: Highlight team qualifications
- **Similar Projects**: Show past experience

### 5. **Application Status**

- **Pending Review**: Waiting for donor decision
- NGO can track status in dashboard

### 6. **Donor Decision Outcomes**

#### If Rejected:

- Receive feedback from donor
- Can view reasons for rejection
- Option to apply to other briefs
- Option to improve profile and reapply

#### If Approved:

- Receive approval notification
- Officially selected as project partner

### 7. **Receive Initial Funding**

- **Amount**: 30% of total project budget
- **Purpose**: Mobilization and initial work
- **Deposit**: Funds go to NGO wallet
- **Status**: Project officially starts

### 8. **Project Execution & Milestone Updates**

For each milestone, NGO follows this process:

**Submission Process:**

1. **Upload Documentation**: Images, reports, evidence of work
2. **Write Description**: Detailed explanation of work done
3. **Update Metrics**: Percentage of target amount covered
4. **Submit Update**: Send to donor for review

**Donor Review:**

- **Verified**: Milestone approved, next payment released
- **Needs Revision**: NGO must fix or clarify issues
- **Rejected**: No payment, project may end

### 9. **Iterative Milestone Process**

- Complete milestone → Donor verifies → Payment released → Next milestone
- Process repeats for all project milestones

### 10. **Project Completion**

- All milestones completed and verified
- Final project report generated automatically
- **Certificate**: NGO receives completion certificate
- **Impact Summary**: View project outcomes and metrics

---

## 🔄 KEY WORKFLOW INTERACTIONS

### Payment Flow

```
Donor Funds Wallet
→ Brief Activated
→ NGO Selected
→ 30% Released to NGO
→ NGO Completes Milestone
→ Donor Verifies
→ Next Tranche Released
→ Repeat Until Completion
```

### Notification Flow

```
Brief Activated (Public/Area-based)
→ Matching NGOs Notified
→ NGO Browses & Reviews
→ NGO Applies
→ Donor Reviews Applications
→ Successful NGO Notified
→ Payment Begins
```

### Quality Assurance Flow

```
NGO Submits Update
→ Donor Reviews Evidence
→ Donor Verifies Completeness
→ If OK: Approve & Release Payment
→ If Issues: Request Revision
→ NGO Resubmits
→ Final Verification
```

---

## 📋 CRITICAL BUSINESS RULES

1. **Wallet Requirement**: Donors MUST have sufficient wallet balance before brief activation
2. **KYC Requirement**: NGOs must complete KYC before receiving payments
3. **30% Upfront**: First payment is always 30% for mobilization
4. **Milestone Gating**: Payments only release after donor verification
5. **Notification System**: Area-based visibility triggers automatic notifications
6. **Draft Safety**: Drafts are invisible to NGOs; no notifications sent
7. **Private Briefs**: Visibility limited to pre-selected NGOs only

---

## 🎯 PLATFORM SUCCESS METRICS

### For Donors

- ✅ Brief activation rate
- ✅ NGO applications received
- ✅ Project completion rate
- ✅ Milestone verification speed

### For NGOs

- ✅ Application success rate
- ✅ Milestone completion on time
- ✅ Donor satisfaction
- ✅ Project portfolio growth

---

## 📱 SYSTEM TOUCHPOINTS

| Actor      | Key Features                                                                                   |
| ---------- | ---------------------------------------------------------------------------------------------- |
| **Donor**  | Dashboard, Brief creation, Wallet management, Application review, Milestone verification       |
| **NGO**    | Dashboard, Opportunity discovery, Application submission, Project tracking, Update submissions |
| **System** | Notifications, Payments, KYC verification, Wallet management, Status tracking                  |

---

Generated: June 1, 2026
