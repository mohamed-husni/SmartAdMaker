SmartAdMaker – AI-based Advertisement Generator

SmartAdMaker is an AI-powered web application that generates **custom promotional posters** based on user prompts.  
It combines **fine-tuned Stable Diffusion models** with an easy-to-use **React + Tailwind frontend** for businesses to design ads quickly.

This project was developed as my **final-year Computer Science research project**.

## 🚀 Features
- **AI-powered poster generation** using fine-tuned Stable Diffusion models  
- **Prompt-based input** (text → ad image)  
- **Modern UI** built with React + Tailwind CSS  
- **Poster editing tools** (Fabric.js canvas integration)  
- **Authentication** (Firebase login/registration)  
- **Image download & resume upload**  
- **Deployed Model** on Hugging Face Hub  

---

## 🛠️ Tech Stack
- **Frontend**: React + Tailwind CSS + Context API  
- **Backend**: Node.js / API routes (for Hugging Face model calls)  
- **Database**: Firebase (Auth & storage), MongoDB (optional for user data)  
- **Model**: Stable Diffusion v1.5 & Stable Diffusion XL (fine-tuned with advertising dataset)  
- **Deployment**:  
  - Model → Hugging Face Hub  
  - CI/CD → GitHub Actions  

---

## 📂 Project Structure
smartadmaker/
├─ frontend/ # React + Tailwind app
│ ├─ src/
│ │ ├─ components/ # UI components (Navbar, Hero, Editor)
│ │ ├─ pages/ # Main pages
│ │ └─ App.js
│
├─ backend/ # Node.js server (optional API layer)
│
├─ model/ # Hugging Face fine-tuned model (training scripts, configs)
│
├─ public/ # Static files (logo, icons)
├─ .github/workflows/ # GitHub Actions CI/CD
└─ README.md

