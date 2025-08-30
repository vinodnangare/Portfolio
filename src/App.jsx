
import React, { useState, useEffect, useRef } from "react";
import { db } from "./firebase/firebase";
import { collection, addDoc, getDoc, doc, updateDoc, onSnapshot, setDoc } from "firebase/firestore";
import toast, { Toaster } from "react-hot-toast";
import "./index.css";
import { Typewriter } from "react-simple-typewriter";
import img from "./Photo.jpg";
import Project1 from "./attendance.png"
import Project2 from "./insurance.png"
import {
  MapPin,
  Download,
  SquareArrowOutUpRight,
  Code2,
  Wrench,
  Users,
  Github,
  Phone,
  Mail,
  Linkedin,
  Award,
  User,
  GraduationCap,
  FolderKanban,
  BadgePercent,
  MessageCircle,
} from "lucide-react";
 
import { FaHtml5, FaCss3Alt, FaJs, FaJava, FaReact, FaNodeJs, FaGitAlt, FaGithub, FaNpm } from "react-icons/fa";
import { SiTailwindcss, SiExpress, SiMongodb, SiFirebase, SiVscodium, SiNetlify, SiPostman } from "react-icons/si";

function App() {
  const [showTop, setShowTop] = useState(false);

  const [active, setActive] = useState("About");
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const sections = ["About", "Education", "Projects", "Skills", "Contact"];
  const sectionIcons = {
    About: <User className="inline mr-2 mb-1" size={20} />,
    Education: <GraduationCap className="inline mr-2 mb-1" size={20} />,
    Projects: <FolderKanban className="inline mr-2 mb-1" size={20} />,
    Skills: <BadgePercent className="inline mr-2 mb-1" size={20} />,
    Contact: <MessageCircle className="inline mr-2 mb-1" size={20} />,
  };
  const sectionRefs = useRef({});
 
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 300);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { 
    const hasLiked = localStorage.getItem("aboutLike");
    if (hasLiked) {
      setLiked(true);
    }
    const likeDocRef = doc(db, "likes", "aboutLike");
    const unsub = onSnapshot(likeDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setLikeCount(docSnap.data().count || 0);
      } else {
        setLikeCount(0);
      }
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        });
      },
      { threshold: 0.5 }
    );

    sections.forEach((id) => {
      if (sectionRefs.current[id]) {
        observer.observe(sectionRefs.current[id]);
      }
    });

    return () => {
      sections.forEach((id) => {
        if (sectionRefs.current[id]) {
          observer.unobserve(sectionRefs.current[id]);
        }
      });
    };
  }, []);

  const handleScroll = (id) => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };
 
  const handleLike = async () => {
    const likeDocRef = doc(db, "likes", "aboutLike");
    const docSnap = await getDoc(likeDocRef);
    let currentCount = docSnap.exists() ? (docSnap.data().count || 0) : 0;
    if (!liked) {
      setLiked(true);
      localStorage.setItem("aboutLike", "true");
      await setDoc(likeDocRef, { count: currentCount + 1 });
    } else {
      setLiked(false);
      localStorage.removeItem("aboutLike");
      await setDoc(likeDocRef, { count: Math.max(currentCount - 1, 0) });
    }
  };
 
  const handleContactSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;
    const email = e.target.email.value;
    const message = e.target.message.value;
    try {
      await addDoc(collection(db, "messages"), {
        name,
        email,
        message,
        timestamp: new Date(),
      });
      toast.success("Thank you for reaching out! I will get back to you soon.");
      e.target.reset();
    } catch (err) {
      toast.error("Failed to send message. Please try again later.");
    }
  };

  return (
    <>
  <Toaster position="top-center" />
  {/* Whole Layout */}
  <div className="relative flex flex-col md:flex-row bg-gray-50">
        {/* Sidebar */}
        <div
          className="hidden md:flex h-screen bg-gray-50 w-[200px] shadow-2xl fixed left-0 top-0 flex-col items-center"
        >
          {/* Profile */}
          <div className="h-[170px] border-b shadow-xl flex items-center justify-center w-full">
            <img
              src={img}
              className="w-[120px] h-[120px] object-cover rounded-full border-4 border-teal-700"
              alt="Profile"
            />
          </div>

          {/* Menu */}
          <div className="flex flex-col items-center mt-3 mx-2 w-full">
            {sections.map((item) => (
              <section
                key={item}
                onClick={() => handleScroll(item)}
                className={`font-medium w-full text-xl text-left flex items-center gap-2 p-3 cursor-pointer transition-all duration-300 relative
                  hover:text-teal-700 hover:shadow-md hover:border-l-4 hover:border-teal-400
                  ${
                    active === item
                      ? "text-teal-700 font-bold border-l-4 border-teal-700 shadow-md bg-teal-50"
                      : ""
                  }`}
              >
                {active === item && <span className="sidebar-indicator" />}
                <span>{sectionIcons[item]}</span>
                <span>{item === "Contact" ? "Contact Me" : item}</span>
              </section>
            ))}
          </div>
        </div>

        {/* Bottom Nav for Mobile */}
        <div className="fixed bottom-0 left-0 w-full bg-white shadow-2xl flex justify-around py-2 md:hidden z-50">
          {sections.map((item) => (
            <button
              key={item}
              onClick={() => handleScroll(item)}
              className={`text-sm font-medium px-3 py-1 ${
                active === item ? "text-teal-700 font-bold" : "text-gray-600"
              }`}
            >
              {item === "Contact" ? "Contact Me" : item}
            </button>
          ))}
        </div>

        {/* Main Content */}
  <div className="flex flex-col w-full md:w-[80%] md:ml-[220px] px-2 md:px-10 py-4 md:py-10 overflow-x-hidden">
        {/* About Section */}


  <div
    id="About"
    ref={(el) => (sectionRefs.current["About"] = el)}
    className="glass relative mt-2 flex flex-col shadow-2xl px-2 sm:px-6 md:px-10 pt-[40px] md:pt-[60px] py-8 transition-all duration-700 ease-in-out hover:shadow-teal-400 hover:-translate-y-2 rounded-lg glow-hover"
> 
  <div className="absolute top-4 right-4 flex items-center bg-white text-black px-4 py-1 rounded-full shadow-lg border border-gray-300 z-20">
    <span className="relative flex h-3 w-3 mr-2">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-700 opacity-100"></span>
       <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
    </span>
    <p className="text-sm font-semibold">Open to Work</p>
  </div>
 <div
  className="flex flex-col absolute right-4 items-center z-10 mt-4 md:mt-0 md:right-12 md:top-[60px]"
  style={{ minHeight: 80 }}
>
  <button
    className={`focus:outline-none rounded-full w-14 h-14 flex items-center justify-center mb-1 transition-all duration-200 ${liked ? 'bg-pink-900/30' : 'bg-pink-900/20'}`}
    onClick={handleLike}
    aria-label="Like"
  >
    {liked ? (
      <svg xmlns="http://www.w3.org/2000/svg" fill="#ff3fa4" viewBox="0 0 24 24" width="32" height="32">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    ) : (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="#b0b0b0" strokeWidth="2.2" viewBox="0 0 24 24" width="32" height="32">
        <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
      </svg>
    )}
  </button>

  {/* text container */}
  <div className="flex flex-col items-center">
    <span className={`text-base font-semibold ${liked ? 'text-pink-400' : 'text-gray-400'}`}>
      {likeCount}
    </span>
    {liked && (
      <span className="flex items-center gap-1 text-pink-400 font-semibold mt-0.5 text-xs">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#ff3fa4" width="16" height="16">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41 0.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </svg>
        Thanks!
      </span>
    )}
  </div>
</div>



   <div className="flex justify-center mb-5 md:hidden">
    <img
      src={img}
      className="w-[180px] h-[180px] object-cover rounded-full border-4 border-teal-700"
      alt="Profile"
    />
  </div>

  <h1 className="text-4xl md:text-5xl text-black font-bold text-center md:text-left">
    Vinod Nangare
  </h1>

   <p className="pt-6 md:pt-10 text-lg md:text-[25px] text-teal-800 font-semibold text-center md:text-left">
  <Typewriter
    words={[
      "React & JavaScript Enthusiast",
      "Full-Stack Developer",
      "Passionate Learner",
      "Building Scalable & User-Friendly Web Apps",
    ]}
    loop={true}
    cursor
    cursorStyle="|"
    typeSpeed={70}
    deleteSpeed={50}
    delaySpeed={1500}
  />
</p>


  <p className="text-gray-500 flex flex-row items-center justify-center md:justify-start mt-3">
    <MapPin className="h-5" />
    &nbsp; Kopargaon, Maharashtra, India
  </p>

  <p className="text-gray-600 mt-4 text-center md:text-left">
    I am an enthusiastic and growth-driven Software Developer with a
    focus on Frontend Development and a growing interest in Full-Stack
    technologies. Skilled in React, JavaScript, HTML, CSS, and
    Tailwind CSS, I have built responsive and interactive web
    applications that prioritize usability and efficiency. I am
    passionate about continuous learning, adapting to new
    technologies, and delivering high-quality code. My goal is to
    contribute to impactful projects by creating scalable,
    user-focused, and innovative solutions while developing into a
    well-rounded full-stack professional.
  </p>

  <div className="flex flex-col sm:flex-row items-center gap-3 justify-center md:justify-start" onClick={()=>window.open("/Resume.pdf")} >
    <a  download className="p-3 rounded-lg bg-teal-700 flex flex-row items-center mt-5 text-white font-semibold hover:shadow-2xl cursor-pointer hover:bg-teal-800 download-animate">
      <Download className="text-white mr-2" /> Download Resume
    </a>
  <div className="scroll-down-indicator" style={{zIndex:10}}>
    ↓
  </div>
    <button
      className="group items-center flex flex-row p-3 border-2 border-teal-600 rounded-lg mt-5 text-teal-600 cursor-pointer hover:shadow-2xl hover:bg-teal-700 hover:text-white hover:font-semibold"
      onClick={() =>
        window.open(
          "https://www.linkedin.com/in/vinod-nangare-7ab09626a/",
          "_blank"
        )
      }
    >
      <SquareArrowOutUpRight className=" text-teal-600 group-hover:text-white w-[56px]" />
      View LinkedIn
    </button>
  </div>
</div>

          {/* Sub-Cards below About */}
          <div className="grid md:grid-cols-2 gap-6 mt-6">
            {/* Connect With Me */}
            <div className="glass shadow-2xl rounded-xl p-4 sm:p-6 transition-all duration-700 ease-in-out hover:shadow-gray-400 hover:-translate-y-2 glow-hover">
              <h3 className="text-xl font-bold text-gray-800 mb-6 bg-gray-50">
                Connect With Me
              </h3>
              <ul className="space-y-6 text-gray-700">
                {/* Email */}
                <li className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white mr-4">
                    <Mail size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Email</p>
                    <a
                      href="mailto:vinodnangare01@gmail.com"
                      className="text-teal-700 hover:underline"
                    >
                      vinodnangare01@gmail.com
                    </a>
                  </div>
                </li>

                {/* Mobile */}
                <li className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white mr-4">
                    <Phone size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">Mobile</p>
                    <span className="text-teal-700">+91 8767071101</span>
                  </div>
                </li>

                {/* LinkedIn */}
                <li className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white mr-4">
                    <Linkedin size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">LinkedIn</p>
                    <a
                      href="https://www.linkedin.com/in/vinod-nangare-7ab09626a/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline"
                    >
                      View Profile
                    </a>
                  </div>
                </li>

                {/* GitHub */}
                <li className="flex items-start">
                  <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white mr-4">
                    <Github size={20} />
                  </div>
                  <div>
                    <p className="font-semibold">GitHub</p>
                    <a
                      href="https://github.com/vinodnangare"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-teal-700 hover:underline"
                    >
                      View Projects
                    </a>
                  </div>
                </li>
              </ul>
            </div>

            {/* Certifications */}
            <div className="glass shadow-2xl rounded-xl p-4 sm:p-6 transition-all duration-700 ease-in-out hover:shadow-gray-400 hover:-translate-y-2 glow-hover">
  <h3 className="text-xl font-bold text-gray-800 mb-6">
    Certifications
  </h3>
  <ul className="space-y-6 text-gray-700">
    <li className="flex items-start">
      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-teal-600 text-white mr-4">
        <Award size={20} />
      </div>
      <div>
        <p className="font-semibold">Google Cloud Study Jam</p>
        <p className="text-gray-500 text-sm">
          Issued by Google Developer Student Clubs
        </p>
        <a
          href="/GoogleTraining.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="text-teal-700 text-sm hover:underline"
        >
          View Certificate
        </a>
      </div>
    </li>
  </ul>
</div>

          </div>

          {/* Education Section */}
          <div
            id="Education"
            ref={(el) => (sectionRefs.current["Education"] = el)}
            className="glass py-8 px-2 sm:px-5 mt-10 shadow-2xl rounded-lg transition-all duration-700 ease-in-out hover:shadow-teal-400 hover:-translate-y-2 glow-hover"
          >
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-10">
              Education
            </h2>

            <div className="relative border-l-4 border-teal-600 ml-10">
              {/* B.Tech */}
              <div className="mb-10 ml-6">
                <div className="absolute w-4 h-4 bg-teal-600 rounded-full -left-2.5"></div>
                <h3 className="text-xl font-semibold text-gray-800">
                  B.Tech in Information Technology
                </h3>
                <p className="text-gray-600">
                  Sanjivani College of Engineering, Kopargaon
                </p>
                <p className="text-sm text-gray-500">2022 – Present (Last Year)</p>
                <p className="text-sm text-teal-700 font-semibold mt-1">CGPA: 7.66</p>
              </div>

              {/* HSC */}
              <div className="mb-10 ml-6">
                <div className="absolute w-4 h-4 bg-teal-600 rounded-full -left-2.5"></div>
                <h3 className="text-xl font-semibold text-gray-800">
                  HSC (12th Science)
                </h3>
                <p className="text-gray-600">
                  Shri Shanishwar Junior College, Sonai
                </p>
                <p className="text-sm text-gray-500">2022</p>
                <p className="text-sm text-teal-700 font-semibold mt-1">64.33%</p>
              </div>

              {/* SSC */}
              <div className="mb-10 ml-6">
                <div className="absolute w-4 h-4 bg-teal-600 rounded-full -left-2.5"></div>
                <h3 className="text-xl font-semibold text-gray-800">
                  SSC (10th)
                </h3>
                <p className="text-gray-600">Mula Public School ,Sonai</p>
                <p className="text-sm text-gray-500">2019 – 2020</p>
                <p className="text-sm text-teal-700 font-semibold mt-1">74.40%</p>
              </div>
            </div>
          </div>

          {/* Projects Section */}
          <div
            id="Projects"
            ref={(el) => (sectionRefs.current["Projects"] = el)}
            className="glass py-8 px-2 sm:px-5 mt-10 shadow-2xl rounded-lg transition-all duration-700 ease-in-out hover:shadow-teal-400 hover:-translate-y-2 glow-hover"
          >
            <h2 className="text-3xl font-bold text-center text-teal-700 mb-10">
              Projects
            </h2>

            <p className="text-center text-gray-600 mb-10">
              Here are some of my recent projects that showcase my skills in
              full-stack development, UI/UX design, and modern web technologies.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Project 1 */}
              <div className="animated-border border rounded-xl shadow-md hover:shadow-xl transition p-3 sm:p-5 bg-gray-50 hover:shadow-black">
                <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 overflow-hidden bg-gray-50">
  <img src={Project1} className="w-full h-full object-cover" />
</div>


                <h3 className="text-2xl font-semibold text-teal-700 mb-3">
                  Attendance Management System
                </h3>
                <p className="text-gray-600 mb-3">
                  A web-based platform to manage and track student attendance,
                  built with Firebase for real-time data and authentication.
                </p>

                <h4 className="font-semibold text-gray-800 mb-2">
                  Key Features:
                </h4>
                <ul className="list-disc list-inside text-gray-600 mb-4">
                  <li>Student and teacher authentication</li>
                  <li>Real-time attendance tracking</li>
                  <li>Data storage with Firebase</li>
                  <li>Responsive UI with Tailwind CSS</li>
                </ul>

                <h4 className="font-semibold text-gray-800 mb-2">
                  Technologies:
                </h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {["React", "Tailwind CSS", "Firebase", "JavaScript"].map(
                    (tech) => (
                      <span
                        key={tech}
                        className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>

                <div className="flex gap-4">
                  <button className="border-2 border-teal-600 text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 hover:text-white transition flex items-center" onClick={()=> window.open("https://github.com/vinodnangare/Attendence-Management-System","_blank")}>
                    <Github className="mr-2 h-5 w-5" /> Code
                  </button>
                  <button className="bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-800 transition flex items-center" onClick={() => window.open("https://attendance-management-systemm.netlify.app/", "_blank")  }>
                    <SquareArrowOutUpRight className="mr-2 h-5 w-5" /> Live Demo
                  </button>
                </div>
              </div>

              {/* Project 2 */}
         <div className="animated-border border rounded-xl shadow-md hover:shadow-xl transition p-3 sm:p-5 bg-gray-50 hover:shadow-black">
  <div className="w-full h-48 bg-gray-200 rounded-lg mb-4 flex items-center justify-center bg-gray-50">
    <img src={Project2} className="h-full object-contain" />
  </div>

  <h3 className="text-2xl font-semibold text-teal-700 mb-3">
    Insurance Management Portal
  </h3>

  <p className="text-gray-600 mb-3">
    Designed and developed a responsive web application for managing insurance
    policies, client registrations, renewals, and revenue tracking using modern
    web technologies.
  </p>

  <h4 className="font-semibold text-gray-800 mb-2">Key Features:</h4>
  <ul className="list-disc list-inside text-gray-600 mb-4">
    <li>Secure client registration and login</li>
    <li>Policy creation, renewal, and deletion</li>
    <li>Revenue tracking with dashboard insights</li>
    <li>Record management with expiry alerts</li>
    <li>Mobile-friendly responsive design</li>
  </ul>

  <h4 className="font-semibold text-gray-800 mb-2">Technologies:</h4>
  <div className="flex flex-wrap gap-2 mb-4">
    {["React.js", "Tailwind CSS", "Firebase", "JavaScript"].map((tech) => (
      <span
        key={tech}
        className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
      >
        {tech}
      </span>
    ))}
  </div>

  <div className="flex gap-4">
    <button
      className="border-2 border-teal-600 text-teal-600 px-4 py-2 rounded-lg font-semibold hover:bg-teal-700 hover:text-white transition flex items-center"
      onClick={() =>
        window.open(
          "https://github.com/vinodnangare/Insurance-Management-Portal",
          "_blank"
        )
      }
    >
      <Github className="mr-2 h-5 w-5" /> Code
    </button>
    <button
      className="bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-teal-800 transition flex items-center"
      onClick={() =>
        window.open(
          "https://shivshakti-insurance-sonai.netlify.app/",
          "_blank"
        )
      }
    >
      <SquareArrowOutUpRight className="mr-2 h-5 w-5" /> Live Demo
    </button>
  </div>
</div>

            </div>
            </div>
          {/* Skills Section */}
<div
  id="Skills"
  ref={(el) => (sectionRefs.current["Skills"] = el)}
  className="glass py-8 px-2 sm:px-5 mt-10 shadow-2xl rounded-lg transition-all duration-700 ease-in-out hover:shadow-teal-400 hover:-translate-y-2 glow-hover"
>
  <h2 className="text-3xl font-bold text-center text-teal-700 mb-10">
    Skills
  </h2>

  <div className="grid gap-8">
    {/* Technical Skills as Icon Grid */}
  <div className="glass bg-teal-50 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition glow-hover">
  <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center bg-gray-50">
        <Code2 className="mr-2" /> Technical Skills
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-6 justify-items-center">
        {/* Skill icons and names */}
        <div className="flex flex-col items-center">
          <FaHtml5 className="text-4xl text-orange-600" />
          <span className="mt-2 text-sm font-medium">HTML</span>
        </div>
        <div className="flex flex-col items-center">
          <FaCss3Alt className="text-4xl text-blue-600" />
          <span className="mt-2 text-sm font-medium">CSS</span>
        </div>
        <div className="flex flex-col items-center">
          <FaJs className="text-4xl text-yellow-400" />
          <span className="mt-2 text-sm font-medium">JavaScript</span>
        </div>
        <div className="flex flex-col items-center">
          <FaJava className="text-4xl text-red-700" />
          <span className="mt-2 text-sm font-medium">Java</span>
        </div>
        <div className="flex flex-col items-center">
          <FaReact className="text-4xl text-cyan-500 animate-spin-slow" />
          <span className="mt-2 text-sm font-medium">React.js</span>
        </div>
        <div className="flex flex-col items-center">
          <SiTailwindcss className="text-4xl text-teal-400" />
          <span className="mt-2 text-sm font-medium">Tailwind</span>
        </div>
        <div className="flex flex-col items-center">
          <FaNodeJs className="text-4xl text-green-700" />
          <span className="mt-2 text-sm font-medium">Node.js</span>
        </div>
        <div className="flex flex-col items-center">
          <SiExpress className="text-4xl text-gray-700" />
          <span className="mt-2 text-sm font-medium">Express.js</span>
        </div>
        <div className="flex flex-col items-center">
          <SiMongodb className="text-4xl text-green-600" />
          <span className="mt-2 text-sm font-medium">MongoDB</span>
        </div>
      </div>
    </div>

    {/* Tools & Technologies + Soft Skills in 2-column */}
    <div className="grid md:grid-cols-2 gap-6">
      {/* Tools & Technologies */}
  <div className="glass bg-teal-50 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition glow-hover">
  <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center bg-gray-50">
          <Wrench className="mr-2" /> Tools & Technologies
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Git",
            "GitHub",
            "VS Code",
            "Firebase",
            "Netlify",
            "Postman",
            "NPM",
          ].map((tool) => (
            <span
              key={tool}
              className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {/* Soft Skills */}
  <div className="glass bg-teal-50 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-xl transition glow-hover">
  <h3 className="text-xl font-bold text-teal-700 mb-4 flex items-center bg-gray-50">
          <Users className="mr-2" /> Soft Skills
        </h3>
        <div className="flex flex-wrap gap-2">
          {[
            "Problem Solving",
            "Team Collaboration",
            "Adaptability",
            "Time Management",
            "Leadership",
          ].map((soft) => (
            <span
              key={soft}
              className="bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-medium"
            >
              {soft}
            </span>
          ))}
        </div>
      </div>
    </div>
  </div>
</div>  
        {/* Contact Me Section */}
        <div
          id="Contact"
          ref={(el) => (sectionRefs.current["Contact"] = el)}
          className="glass py-8 px-2 sm:px-5 mt-10 shadow-2xl rounded-lg transition-all duration-700 ease-in-out hover:shadow-teal-400 hover:-translate-y-2 glow-hover"
        >
          <h2 className="text-3xl font-bold text-center text-teal-700 mb-8">
            Contact Me
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Interested in working together or have an opportunity? Leave a message below!
          </p>
          <form
            className="max-w-xl mx-auto flex flex-col gap-6"
            onSubmit={handleContactSubmit}
          >
            <div>
              <label className="block text-teal-700 font-semibold mb-2" htmlFor="name">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-600"
                placeholder="Your Name"
              />
            </div>
            <div>
              <label className="block text-teal-700 font-semibold mb-2" htmlFor="email">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-600"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-teal-700 font-semibold mb-2" htmlFor="message">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows="5"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:border-teal-600"
                placeholder="Type your message here..."
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full bg-teal-700 text-white font-semibold py-3 rounded-lg hover:bg-teal-800 transition shadow-lg pulse-cta"
            >
              Let's Connect
            </button>
          </form>
        </div>
        {/* End Contact Me Section */}
        </div>
      </div>
      {showTop && (
        <button className="back-to-top" onClick={() => window.scrollTo({top:0,behavior:'smooth'})} aria-label="Back to top">
          ↑
        </button>
      )}
    </>
  );
}
export default App;




