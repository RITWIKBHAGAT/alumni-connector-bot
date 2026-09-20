# Alumni Connector Bot — Alumni Data & Matchmaking Engine

This repository contains the fictional alumni dataset and data models for the **Alumni Connector Bot** group project.

---

## 1. Dataset Overview

* **Total Records**: 50 synthetic / fictional alumni profiles.
* **Safety & Privacy Compliance**: 100% fictional test records. No LinkedIn scraping, no real person data, no private personal information.
* **Formats Available**:
  * JSON: `data/alumni_data.json`
  * CSV: `data/alumni_data.csv`
* **Domain / Function Breakdown**:
  | Function | Count | Example Industry Verticals | Example Roles |
  | :--- | :---: | :--- | :--- |
  | **Consulting** | 6 | Management Consulting, Healthcare, Tech Advisory | Senior Management Consultant, Life Sciences Consultant |
  | **Finance** | 6 | Investment Banking, Private Equity, FinTech, FP&A | Investment Banking Associate, PE Senior Analyst, FP&A Manager |
  | **Marketing** | 6 | Mobile Apps, Consumer Retail, B2B SaaS, E-Commerce | Growth Marketing Director, Product Marketing Manager, Brand Strategy Lead |
  | **Human Resources** | 5 | AI Tech, Logistics, Enterprise Software, Healthcare | Senior Technical Recruiter, HRBP Lead, Total Rewards Analyst |
  | **Operations** | 5 | Maritime Logistics, Aerospace Mfg, E-Commerce Warehousing | Global Supply Chain Director, Lean Six Sigma Leader, RevOps Manager |
  | **Product Management** | 6 | FinTech, Cloud Infrastructure, Media Streaming, GenAI | Principal PM, Technical Cloud PM, Growth PM, AI Product Manager |
  | **Business Analytics** | 6 | Omnichannel Retail, Travel Tech, Gaming, Healthcare | Senior BI Analyst, Customer Insights Lead, Risk Analytics Specialist |
  | **IT (Information Technology)**| 5 | Cloud DevOps, Cybersecurity, Telecom, Networking | Cloud Architect, Cyber SOC Engineer, Enterprise Systems Admin |
  | **Sales** | 5 | Enterprise SaaS, Sales Tech, Medical Devices | Enterprise Account Executive, Solutions Consultant, SDR Lead |

---

## 2. Profile Schema Fields

Each alumnus profile contains the 12 required fields:

| # | Field | Type | Description |
| :---: | :--- | :--- | :--- |
| 1 | `id` | string | Unique record identifier (e.g., `ALUM-001` to `ALUM-050`) |
| 2 | `name` | string | Culturally diverse fictional full name |
| 3 | `graduation_year` | integer | Graduation year (2014–2022) |
| 4 | `degree` | string | Academic degree and major (e.g., `MBA in Strategy & Finance`, `B.S. in Computer Science`) |
| 5 | `current_company` | string | Fictional company name |
| 6 | `current_role` | string | Current job title |
| 7 | `industry` | string | Industry vertical (e.g., `Management Consulting`, `Financial Technology (FinTech)`, `Enterprise B2B SaaS`) |
| 8 | `function` | string | One of the 9 required domain functions |
| 9 | `skills` | list[str] | 4–5 core functional and technical skills |
| 10 | `location` | string | Metropolitan location (e.g., `Chicago, IL`, `New York, NY`) |
| 11 | `years_of_experience` | integer | Total workforce experience (2 to 10 years, aligned with graduation year) |
| 12 | `career_summary` | string | Narrative summary of career path, focus areas, and achievements |

---

## 3. Validation

To validate JSON formatting, schema compliance, field presence, data types, and function coverage:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/validate_dataset.ps1
```

Validation confirms:
* Valid JSON syntax (parses with 0 syntax errors)
* Exactly 50 records
* All 12 required fields populated across all records (no null/empty values)
* Correct data types (`skills` as array, `graduation_year` and `years_of_experience` as integers)
* Full representation across all 9 domain functions
