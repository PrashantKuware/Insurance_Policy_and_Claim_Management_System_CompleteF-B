import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./style.css";

const menuItems = ["Home", "About", "Service", "Contact"];

const Navbar = () => {
  const navRef = useRef(null);
  const activeRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const getOffsetLeft = (element) => {
    const navRect = navRef.current.getBoundingClientRect();
    const elRect = element.getBoundingClientRect();

    return (
      elRect.left -
      navRect.left +
      (elRect.width - activeRef.current.offsetWidth) / 2
    );
  };

  const createSVG = (element) => {
    element.innerHTML = `
      <svg viewBox="0 0 116 5" preserveAspectRatio="none" class="beam">
        <path d="M0.5 2.5L113 0.534929C114.099 0.515738 115 1.40113 115 2.5C115 3.59887 114.099 4.48426 113 4.46507L0.5 2.5Z" fill="url(#gradient-beam)"/>
        <defs>
          <linearGradient id="gradient-beam" x1="2" y1="2.5" x2="115" y2="2.5">
            <stop stop-color="#0270ffff"/>
            <stop offset="1" stop-color="white"/>
          </linearGradient>
        </defs>
      </svg>
      <div class="strike"></div>
    `;
  };

  useEffect(() => {
    const nav = navRef.current;
    const activeElement = activeRef.current;

    const buttons = nav.querySelectorAll("ul li button");
    const activeButton = buttons[activeIndex];

    document.fonts.ready.then(() => {
      gsap.set(activeElement, {
        x: getOffsetLeft(activeButton),
      });

      gsap.to(activeElement, {
        opacity: 1,
        duration: 0.2,
      });
    });
  }, []);

  const handleClick = (index) => {
    const nav = navRef.current;
    const activeElement = activeRef.current;

    const buttons = nav.querySelectorAll("ul li button");
    const oldButton = buttons[activeIndex];
    const newButton = buttons[index];

    if (index === activeIndex) return;

    const x = getOffsetLeft(newButton);
    const oldX = getOffsetLeft(oldButton);
    const direction = index > activeIndex ? "after" : "before";

    nav.classList.add(direction);

    setActiveIndex(index);

    gsap.to(activeElement, {
      x,
      duration: 0.6,
      ease: "none",
    });

    gsap.to(activeElement, {
      keyframes: [
        {
          width: Math.abs(x - oldX),
          duration: 0.3,
          onStart: () => {
            createSVG(activeElement);
            gsap.to(activeElement, { opacity: 1, duration: 0.1 });
          },
        },
        {
          width: 0,
          scaleX: 0,
          scaleY: 0.25,
          duration: 0.3,
          onComplete: () => {
            activeElement.innerHTML = "";
            nav.classList.remove("before", "after");
          },
        },
      ],
    });
  };

  return (
    <nav ref={navRef}>
      <ul>
        {menuItems.map((item, index) => (
          <li key={item} className={index === activeIndex ? "active" : ""}>
            <button onClick={() => handleClick(index)}>{item}</button>
          </li>
        ))}
      </ul>

      <div className="active-element" ref={activeRef}></div>
    </nav>
  );
};

export default Navbar;