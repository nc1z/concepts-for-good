# GOOD_SG Ideation Index

Use this file for fast idea-generation context before opening [`ideas/GOOD_SG.json`](/Users/nc/Desktop/code/github/concepts-for-good/ideas/GOOD_SG.json). It summarizes the current spread of ideas so future prompts can spot crowded areas, thin areas, and recurring user groups without loading the full dataset first.

## Snapshot

- Total ideas: `160`
- Implemented ideas: `12`
- Unimplemented ideas: `148`
- Primary region: Singapore
- Primary lens: public good, social impact, civic usefulness, and real everyday friction

## Category Map

| Category | Count | Implemented | Example ideas | Notes for future ideation |
| --- | ---: | ---: | --- | --- |
| support | 10 | 0 | Legal Aid Prep; ComCare Renewal Calendar; CDC Help Guide | Strong on assistance/admin support. Add only if the interaction model is genuinely new. |
| community care | 9 | 0 | Void Deck Activity Planner; Neighbour Help Request; Care Package Builder | Broad and useful. Good place for neighbour coordination and hyperlocal caregiving variations. |
| cost of living | 9 | 0 | Rent Split Planner; Pocket Expense Diary; Weekly Menu Coster | Already active. New ideas should be more specific, such as hawker economics or life-stage budgeting. |
| housing | 9 | 0 | Laundry Queue Share; Roommate Welcome Kit; HDB Move Checklist | Good HDB and shared-living base. Still room for rental friction, flat upkeep, and estate-level coordination. |
| education equity | 8 | 0 | Homework Quiet Timer; Library Skills Share; Uniform Reuse | Strong student support coverage. Look for graduate transition or non-school learning angles next. |
| inclusion | 8 | 0 | Rest Day Planner; Domestic Help Support; Multi-Language Help Card | Good breadth. New ideas should avoid repeating generic resource directories. |
| local food | 8 | 0 | Garden Task Relay; Leftover Lunch Planner; Fridge Share Shelf | Food/community overlap is healthy. Hawker livelihood and stall operations can expand this space differently. |
| school support | 8 | 0 | School Fee Reminder; Lunch Queue Buddy; Parent Teacher Prep | Parent and school admin flows are well covered. Aim for student transition or graduate outcomes instead of more admin tools. |
| urban access | 8 | 0 | Carpark Chance; Taxi Gap Watch; Rain Window Planner | Strong public-API-friendly category. New ideas should combine transport with a clearer target user pain point. |
| family life | 7 | 0 | Family Visit Balance; Budget Date Night; Family Calendar Merge | Good family logistics base. Still room for couple, newlywed, and caregiving-overlap flows. |
| social connection | 7 | 0 | Block Potluck Planner; Community Cooking Circle; Halal Potluck Match | Healthy set of social ideas. Hobby-driven belonging is still underrepresented. |
| sustainability | 7 | 0 | Item Life; Textile Reuse; Repair Cafe Board | Strong reuse/repair direction. Avoid adding another generic recycling explainer. |
| accessibility | 6 | 4 | Accessible Mall Route; MRT Lift Note; Quiet Places | One of the most built-out categories already. New additions need a very specific unmet accessibility angle. |
| caregiving | 6 | 0 | Dementia Walk Companion; Care Visit Log; Respite Day Planner | Strong practical care theme. Plenty of room for caregiver stress, respite, and family coordination edges. |
| public health | 6 | 0 | Cleaner Air Hour; UV Safe Outing; Heat Safe Walk | Good environment-health crossover. Useful for public APIs when tied to decisions, not raw dashboards. |
| aging | 5 | 4 | Senior Check-In; Medication Reminder; Digital Help for Seniors | Mostly implemented already. New senior ideas should avoid repeating check-ins and reminder mechanics. |
| environment | 5 | 0 | Flood Prep; Flash Flood Crossing; Rain Shelter Map | Weather resilience exists, but can still branch into estate-level or household-prep use cases. |
| family access | 5 | 0 | Nursing Room; Inclusive Playground; Stroller Route | Practical and family-facing. More “out with children” support is still possible. |
| food security | 5 | 1 | Food Donation Route; Volunteer Run Weather Check; Hawker Weather Match | Useful but still small. Room for hawker affordability, meal access, and volunteer food logistics. |
| wellness | 5 | 0 | Heat Break Finder; Steps Together; Water Reminder | General wellness is present. Future additions should be more situation-specific, not generic habit tracking. |
| biodiversity | 4 | 0 | Beach Cleanup Board; Pollinator Spotter; Mangrove Visit Planner | Small but distinct. Keep additions experiential and place-based. |
| civic | 4 | 3 | Volunteer Match; Skills for Good; Volunteer Hours | Mostly implemented. New ideas here need a clear civic workflow gap. |
| mental health | 4 | 0 | Stress Check Card; Breathing Break; Burnout Boundary | Underweight relative to repo goals. Good expansion area for affordability, routines, peer support, and work stress. |
| social norms | 4 | 0 | Quiet Carriage Notes; Transit Kindness; Small Acts | Small but coherent. Add only if there is a strong behavior-shaping mechanic. |
| health systems | 2 | 0 | Clinic Visit Pack; Blood Reminder | Thin category. Good candidate for more appointment, navigation, or cost-transparency ideas. |
| safety | 2 | 0 | Traffic Camera Check; HDB Fire Escape | Very thin. Good place for estate, household, or caregiver-facing safety ideas. |
| digital safety | 1 | 0 | Scam Check Pause | Thinnest category in the dataset. Strong opportunity area if the interaction model is concrete and not lecture-like. |

## Persona Coverage

These counts come from the `personas` field and show which user types appear most often.

| Persona | Count | Notes |
| --- | ---: | --- |
| resident | 121 | Default civic/general user. New ideas should get more specific when possible. |
| caregiver | 81 | Very common. Strong theme, but easy to duplicate unless the workflow is sharply different. |
| senior | 49 | Already well served, including implemented apps. |
| volunteer | 46 | Common and already partially implemented. |
| student | 27 | Good base, but graduate and first-job transitions need more room. |
| coordinator | 23 | Often appears in volunteer/community logistics flows. |
| parent_or_tutor | 13 | Present but less central than plain `target_user` strings suggest. |
| worker | 7 | Underused relative to stress, burnout, and career-switch needs. |

## High-Value Gaps

- Hawker livelihoods: rent pressure, stall operations, shared family labour, quiet periods, footfall assumptions, and supplier coordination.
- Employment transitions: fresh graduates, first-job uncertainty, interview confidence, career switchers, and sustainable job hunting.
- Hobbies and belonging: low-pressure hobby discovery, buddy matching, small local circles, and social re-entry for anxious or introverted users.
- Mental health: affordability, burnout recovery, work stress, peer check-ins, and “what can I do today” flows.
- Thin categories worth expanding: `digital safety`, `safety`, and `health systems`.

## Guardrails For New Ideas

- Prefer a clearly different `ui.interaction_model` over a new title in an already crowded category.
- Avoid duplicating implemented mechanics in accessibility, aging, and civic unless the audience/problem is materially different.
- If the idea uses a public API, frame it around a user decision, not a monitoring dashboard.
- If the idea is broad, narrow it to one Singapore-specific moment: a hawker shift, a first interview, a flat move, a rainy school run, a rest day, or a clinic visit.
- Use the full JSON only when editing, validating IDs, checking duplicates, or finalizing schema-complete entries.
