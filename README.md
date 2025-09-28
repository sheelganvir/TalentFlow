<img width="1400" height="500" alt="image" src="https://github.com/user-attachments/assets/02117049-20e3-4d81-a61c-6ac98fa57ad1" />


# 🌟 Talentflow

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-38B2AC?logo=tailwind-css)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)
![MSW](https://img.shields.io/badge/MSW-2.11-orange?logo=mock-service-worker)
![License](https://img.shields.io/badge/License-MIT-green)

> **Talentflow** is a **production-like hiring tool** built with **Next.js 15, React 19, TailwindCSS 4, and MSW**.  
It simulates a real-world hiring platform — managing **Jobs, Candidates, and Assessments** — all **in the browser** with persistence powered by **IndexedDB**.  

🌍 **Live Demo:** [https://talentflow.live](https://talentflow.live)

---

## 📸 Preview

<p align="center">
  <img width="1895" height="906" alt="image" src="https://github.com/user-attachments/assets/ed8b2451-505b-428b-b616-79ff499ede0f" />
</p>

<!-- Replace below with actual screenshots -->

<table>
  <tr>
    <td><img width="1895" height="906" alt="image" src="https://github.com/user-attachments/assets/ed8b2451-505b-428b-b616-79ff499ede0f" /></td>
    <td><img width="1894" height="888" alt="image" src="https://github.com/user-attachments/assets/47b04a64-ee69-49e8-9570-caaeb63511a0" />
</td>
  </tr>
  <tr>
    <td><img width="1888" height="894" alt="image" src="https://github.com/user-attachments/assets/a6f824b8-1680-4657-b522-bee26edea0aa" /></td>
    <td><img width="1890" height="900" alt="image" src="https://github.com/user-attachments/assets/b38da731-5550-42eb-8ba0-df652d65b592" /></td>
  </tr>
  <tr>
    <td><img width="1885" height="896" alt="image" src="https://github.com/user-attachments/assets/d4ee079b-38f2-421f-80bb-2443c3736321" /></td>
    <td><img width="1879" height="905" alt="image" src="https://github.com/user-attachments/assets/d456c788-cd52-4ae4-bdce-82bff5a72a83" />
</td>
  </tr>
  <tr>
    <td><img width="1891" height="894" alt="image" src="https://github.com/user-attachments/assets/9b35c19c-8951-41f7-95c4-fb5e06036406" /></td>
    <td><img width="1876" height="904" alt="image" src="https://github.com/user-attachments/assets/a8051522-323a-46c5-8111-4b8502f172b5" />
</td>
  </tr>
  
</table>


---

## 🚀 Features

### 🎯 Core Functionality
- **Jobs Board**
  - Create, edit, archive, reorder jobs with **drag-and-drop**  
  - Search, filter, sort, and paginate  
  - Deep-linkable query params  

- **Candidates**
  - Virtualized list for **1,000+ candidates**  
  - Search (debounced), filter by stage, infinite scroll/pagination  
  - Kanban view with **drag-and-drop stage movement**  

- **Candidate Profile**
  - Timeline of immutable events (applied, stage transitions, assessment submissions)  
  - Notes with **@mentions**  
  - Attachments (stub)  

- **Assessments**
  - **Builder:** Add sections, reorder, create questions (single/multi choice, text, numeric, file upload)  
  - **Runtime:** Validations, conditional logic, save-and-resume  
  - Responses persist locally + timeline event  

---

### ⚡ UX Foundations
- Simulated network with **200–1200ms latency**  
- **5–10% write error rate** for realistic rollback & retry  
- Optimistic updates with rollback UX + toasts  
- Virtualized lists for performance  
- Skeleton loaders and thoughtful empty states  

---

### ♿ Accessibility
- Semantic HTML, ARIA roles, visible focus states  
- Keyboard navigation across lists, dialogs, drag-and-drop  
- Proper form labeling (`aria-*`)  

---

## 🏗️ Architecture
```
📦 
├─ .gitattributes
├─ .gitignore
├─ README.md
├─ app
│  ├─ assessments
│  │  ├─ builder
│  │  │  └─ [id]
│  │  │     └─ page.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ candidates
│  │  ├─ [id]
│  │  │  └─ page.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ client-layout.tsx
│  ├─ favicon.ico
│  ├─ globals.css
│  ├─ jobs
│  │  ├─ [jobId]
│  │  │  ├─ loading.tsx
│  │  │  └─ page.tsx
│  │  ├─ loading.tsx
│  │  └─ page.tsx
│  ├─ layout.tsx
│  └─ page.tsx
├─ components.json
├─ components
│  ├─ floating-sidebar.tsx
│  ├─ msw-provider.tsx
│  ├─ site-footer.tsx
│  ├─ theme-provider.tsx
│  └─ ui
│     ├─ accordion.tsx
│     ├─ alert-dialog.tsx
│     ├─ alert.tsx
│     ├─ aspect-ratio.tsx
│     ├─ avatar.tsx
│     ├─ badge.tsx
│     ├─ breadcrumb.tsx
│     ├─ button.tsx
│     ├─ calendar.tsx
│     ├─ card.tsx
│     ├─ carousel.tsx
│     ├─ chart.tsx
│     ├─ checkbox.tsx
│     ├─ collapsible.tsx
│     ├─ command.tsx
│     ├─ context-menu.tsx
│     ├─ dialog.tsx
│     ├─ drawer.tsx
│     ├─ dropdown-menu.tsx
│     ├─ floating-sidebar.tsx
│     ├─ form.tsx
│     ├─ hover-card.tsx
│     ├─ input-otp.tsx
│     ├─ input.tsx
│     ├─ label.tsx
│     ├─ menubar.tsx
│     ├─ navigation-menu.tsx
│     ├─ pagination.tsx
│     ├─ popover.tsx
│     ├─ progress.tsx
│     ├─ radio-group.tsx
│     ├─ resizable.tsx
│     ├─ scroll-area.tsx
│     ├─ select.tsx
│     ├─ separator.tsx
│     ├─ sheet.tsx
│     ├─ sidebar.tsx
│     ├─ skeleton.tsx
│     ├─ slider.tsx
│     ├─ sonner.tsx
│     ├─ switch.tsx
│     ├─ table.tsx
│     ├─ tabs.tsx
│     ├─ textarea.tsx
│     ├─ toast.tsx
│     ├─ toaster.tsx
│     ├─ toggle-group.tsx
│     ├─ toggle.tsx
│     ├─ tooltip.tsx
│     ├─ use-mobile.tsx
│     └─ use-toast.ts
├─ data
│  ├─ assessments.ts
│  └─ candidates.ts
├─ hooks
│  ├─ use-mobile.ts
│  └─ use-toast.ts
├─ lib
│  ├─ api
│  │  ├─ assessments.ts
│  │  ├─ candidates.ts
│  │  └─ jobs.ts
│  ├─ msw
│  │  ├─ browser.ts
│  │  ├─ handlers
│  │  │  ├─ assessments.ts
│  │  │  ├─ candidates.ts
│  │  │  ├─ index.ts
│  │  │  └─ jobs.ts
│  │  ├─ server.ts
│  │  └─ setup.ts
│  └─ utils.ts
├─ next.config.mjs
├─ next.config.ts
├─ package-lock.json
├─ package.json
├─ postcss.config.mjs
├─ public
│  ├─ file.svg
│  ├─ globe.svg
│  ├─ images
│  │  └─ talentflow-logo.png
│  ├─ mockServiceWorker.js
│  ├─ next.svg
│  ├─ placeholder-logo.png
│  ├─ placeholder-logo.svg
│  ├─ placeholder-user.jpg
│  ├─ placeholder.jpg
│  ├─ placeholder.svg
│  ├─ professional-engineer.png
│  ├─ professional-man-developer.png
│  ├─ professional-man.jpg
│  ├─ professional-woman-designer.png
│  ├─ professional-woman-diverse.png
│  ├─ professional-woman-manager.png
│  ├─ vercel.svg
│  └─ window.svg
├─ styles
│  └─ globals.css
├─ tsconfig.json
└─ types
   └─ job.ts
```


---

## ⚙️ Tech Stack

| Category          | Tech |
|-------------------|------|
| Framework         | [Next.js 15](https://nextjs.org/) |
| Language          | [TypeScript](https://www.typescriptlang.org/) |
| UI                | [React 19](https://react.dev/), [TailwindCSS 4](https://tailwindcss.com/), [shadcn/ui](https://ui.shadcn.com/) |
| State/Data        | [SWR](https://swr.vercel.app/) (or similar), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API) |
| API Simulation    | [MSW](https://mswjs.io/), Mirage (optional) |
| DnD               | [hello-pangea/dnd](https://hello-pangea.com/) |
| Charts            | [Recharts](https://recharts.org/) |
| Forms & Validation| [react-hook-form](https://react-hook-form.com/), [zod](https://zod.dev/) |

---

## 📦 Installation & Local Setup

1. **Clone the repo**
   ```bash
   git clone https://github.com/sheelganvir/TalentFlow.git
   cd talentflow
   
2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   
3. **Start development server**
   ```bash
   npm run dev

4. **Build for production**
   ```bash
   npm run build
   npm start
--- 

# 🌐 Deployment (Vercel + GoDaddy Domain)

- This project is hosted on Vercel and uses a custom domain from GoDaddy.

## Steps:

### Deploy to Vercel
```bash
vercel
```
Or connect the repo directly from GitHub via Vercel Dashboard.

### Buy/Manage Domain
- Purchased `talentflow.live` on GoDaddy.

### Point Domain to Vercel
In GoDaddy DNS Settings, add a CNAME record:
- **Name:** `www`
- **Value:** `cname.vercel-dns.com`

Add an A record pointing root `@` to Vercel's IP if required.

Alternatively, use Nameservers from Vercel and update them in GoDaddy.

### Verify in Vercel
Add the custom domain `talentflow.live` in the Vercel dashboard.

SSL is auto-provisioned via Let's Encrypt. 🔒

**✅ Live project:** https://talentflow.live

---

## 🧪 Simulated API

Talentflow intercepts requests like:
- `GET /jobs?search=&status=&page=&pageSize=&sort=`
- `POST /jobs`
- `PATCH /jobs/:id`
- `GET /candidates?search=&stage=&page=`
- `PATCH /candidates/:id`
- `GET /assessments/:jobId`
- `POST /assessments/:jobId/submit`

All reads/writes go through MSW → IndexedDB

- Write errors (5–10%) trigger rollback + toast notifications
- Latency: 200–1200ms delays mimic real servers

---

## 🎨 UI/UX Highlights

- Polished skeletons while loading
- Empty states with helpful CTAs
- Deep-linkable filters/sorts/pagination
- Autosave in Assessment Builder with debounced writes
- Retry buttons for failed operations

---

## 📊 Example Workflows

- Recruiter creates a job → it appears instantly in the Jobs list
- Candidate applies → appears in Candidates list → recruiter drags to new stage in Kanban
- Recruiter configures Assessment → Candidate completes it → submission logged in timeline

---

## 🤝 Contributing

Contributions are welcome! 🎉

1. Fork this repo
2. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add your feature"
   ```
4. Push to branch:
   ```bash
   git push origin feature/your-feature
   ```
5. Open a Pull Request

---

## 📜 License

MIT © 2025 Talentflow

---

## 🌍 Project Status

✅ MVP complete

🚀 **Future improvements:**
- Bulk candidate actions (multi-select + stage change)
- Assessment import/export templates
- E2E tests with Playwright
- Dark mode polish

---

👉 **With Talentflow, you get a realistic, resilient, and accessible hiring tool — all running in your browser.**

## 💡 Author

Made with 💙 by Sheel Ganvir

📬 sheelganvir2805@gmail.com

🌐 [LinkedIn](https://www.linkedin.com/in/sheel-ganvir/)

---

## ⭐ If you found this project helpful, feel free to star the repo and share it!

