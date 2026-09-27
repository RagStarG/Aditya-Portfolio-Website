"use strict";

/* =====================================================
   ADITYA.exe
   MAIN JAVASCRIPT
===================================================== */


/* =====================================================
   ELEMENTS
===================================================== */

const intro = document.getElementById("intro");
const introVideo = document.getElementById("introVideo");
const skipIntro = document.getElementById("skipIntro");

const screenBreak = document.getElementById("screenBreak");
const app = document.getElementById("app");

const typingText = document.getElementById("typingText");

const sendMail = document.getElementById("sendMail");
const pigeon = document.getElementById("pigeon");

const projectModal = document.getElementById("projectModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

const chaosButton = document.getElementById("chaosButton");
const panicButton = document.getElementById("panicButton");


/* =====================================================
   INTRO SYSTEM
===================================================== */

let introComplete = false;

function openMainWebsite() {

    if (introComplete) {
        return;
    }

    introComplete = true;

    if (introVideo) {
        introVideo.pause();
    }

    screenBreak.classList.add("active");

    setTimeout(() => {

        intro.classList.add("hide");

        app.classList.add("visible");

        document.body.style.overflowX = "hidden";

        startTyping();

        /*
            Music is started here if browser allows it.
            Otherwise the first click will start it.
        */

        startMusic();

    }, 900);

}


/* Video finished */

if (introVideo) {

    introVideo.addEventListener(
        "ended",
        openMainWebsite
    );

}


/* Skip */

if (skipIntro) {

    skipIntro.addEventListener(
        "click",
        openMainWebsite
    );

}


/* Video autoplay */

window.addEventListener(
    "load",
    () => {

        if (!introVideo) {
            openMainWebsite();
            return;
        }

        introVideo.play().catch(() => {

            /*
                Browser blocked autoplay.
                User can click anywhere on the intro.
            */

            const resumeVideo = () => {

                introVideo.play().catch(() => {});

                document.removeEventListener(
                    "click",
                    resumeVideo
                );

            };

            document.addEventListener(
                "click",
                resumeVideo
            );

        });

    }
);


/* Keep the intro video reliable on desktop/mobile. */
if (introVideo) {
    introVideo.addEventListener("loadedmetadata", () => {
        introVideo.style.visibility = "visible";
    });

    introVideo.addEventListener("stalled", () => {
        introVideo.play().catch(() => {});
    });
}

/* If video cannot load */

if (introVideo) {

    introVideo.addEventListener(
        "error",
        () => {

            /*
                Give the user enough time to see
                the intro, then continue.
            */

            setTimeout(
                openMainWebsite,
                2500
            );

        }
    );

}


/* =====================================================
   TYPING EFFECT
===================================================== */

const phrases = [
    "Software Engineer-ish.",
    "Backend Builder.",
    "AI / ML Explorer.",
    "Cybersecurity Enthusiast.",
    "Digital Forensics Nerd.",
    "Professional Problem Overthinker."
];

let phraseIndex = 0;
let charIndex = 0;
let deleting = false;
let typingStarted = false;

function startTyping() {

    if (typingStarted) {
        return;
    }

    typingStarted = true;

    typeLoop();

}

function typeLoop() {

    const currentPhrase =
        phrases[phraseIndex];

    if (!deleting) {

        charIndex++;

        typingText.textContent =
            currentPhrase.substring(
                0,
                charIndex
            );

        if (
            charIndex >=
            currentPhrase.length
        ) {

            deleting = true;

            setTimeout(
                typeLoop,
                1400
            );

            return;

        }

    } else {

        charIndex--;

        typingText.textContent =
            currentPhrase.substring(
                0,
                charIndex
            );

        if (charIndex <= 0) {

            deleting = false;

            phraseIndex =
                (phraseIndex + 1) %
                phrases.length;

        }

    }

    setTimeout(
        typeLoop,
        deleting ? 35 : 65
    );

}


/* =====================================================
   BACKGROUND MUSIC
===================================================== */

let audioContext = null;
let masterGain = null;
let musicStarted = false;
let musicTimer = null;

function startMusic() {

    if (musicStarted) {
        return;
    }

    try {

        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;

        if (!AudioContext) {
            return;
        }

        audioContext =
            new AudioContext();

        masterGain =
            audioContext.createGain();

        /*
            Full-volume master setting.

            The individual notes are kept controlled
            so the music doesn't clip badly.
        */

        masterGain.gain.value = 0.9;

        masterGain.connect(
            audioContext.destination
        );

        musicStarted = true;

        const notes = [
            110,
            138.59,
            164.81,
            220,
            164.81,
            146.83,
            123.47,
            196
        ];

        let noteIndex = 0;

        function playNote() {

            if (!audioContext) {
                return;
            }

            const oscillator =
                audioContext.createOscillator();

            const gain =
                audioContext.createGain();

            oscillator.type = "sawtooth";

            oscillator.frequency.value =
                notes[
                    noteIndex %
                    notes.length
                ];

            const now =
                audioContext.currentTime;

            gain.gain.setValueAtTime(
                0.0001,
                now
            );

            gain.gain.exponentialRampToValueAtTime(
                0.045,
                now + 0.02
            );

            gain.gain.exponentialRampToValueAtTime(
                0.0001,
                now + 0.22
            );

            oscillator.connect(gain);
            gain.connect(masterGain);

            oscillator.start(now);

            oscillator.stop(
                now + 0.24
            );

            noteIndex++;

            musicTimer =
                setTimeout(
                    playNote,
                    260
                );

        }

        if (
            audioContext.state ===
            "suspended"
        ) {

            audioContext.resume()
                .then(() => {

                    playNote();

                })
                .catch(() => {});

        } else {

            playNote();

        }

    } catch (error) {

        console.warn(
            "Music unavailable:",
            error
        );

    }

}


/*
    Browsers may block audio until user interaction.

    This ensures the music starts on the first
    interaction with the page.
*/

document.addEventListener(
    "pointerdown",
    () => {

        if (!musicStarted) {
            startMusic();
        }

        if (
            audioContext &&
            audioContext.state === "suspended"
        ) {

            audioContext.resume()
                .catch(() => {});

        }

    },
    {
        once: true
    }
);


/* =====================================================
   PROJECT DATA
===================================================== */

const projects = {

    blackbox: {

        title: "BLACKBOX",

        content: `
            <h2>BLACKBOX</h2>

            <p>
                Digital Forensics & Investigative
                Intelligence Platform.
            </p>

            <div class="modal-console">

                $ ./blackbox --boot

                <br>

                > Initializing evidence engine...

                <br>

                > PostgreSQL ........ OK

                <br>

                > Redis ............. OK

                <br>

                > MinIO ............. OK

                <br>

                > OCR engine ........ READY

                <br>

                > Entity extraction . READY

                <br>

                > Relationship graph READY

                <br><br>

                <strong>
                    SYSTEM STATUS: OPERATIONAL
                </strong>

            </div>
        `
    },


    authshield: {

        title: "AUTHSHEILD",

        content: `
            <h2>AUTHSHEILD</h2>

            <p>
                Passive-first web authentication
                security auditor.
            </p>

            <div class="modal-console">

                TARGET:

                <input
                    id="securityTarget"
                    class="demo-input"
                    value="https://example.com/login"
                >

                <button
                    id="runAudit"
                >
                    RUN SECURITY AUDIT
                </button>

                <div
                    id="auditOutput"
                    class="demo-output"
                >
                    Waiting for scan...
                </div>

            </div>
        `
    },


    serpico: {

        title: "SERPICO",

        content: `
            <h2>SERPICO</h2>

            <p>
                Security and investigation platform
                for structured analysis and automated
                processing.
            </p>

            <div class="modal-console">

                CASE #001

                <br>
                ─────────────────────

                <br>
                STATUS: ACTIVE

                <br><br>

                [ENTITY] Subject-A

                <br>

                [EVENT] Transaction

                <br>

                [DATA] Evidence File

                <br>

                [LINK] Relationship Found

                <br><br>

                GRAPH ENGINE

                <br>

                ████████████████████ 100%

            </div>
        `
    },


    sentinel: {

        title: "SENTINEL",

        content: `
            <h2>SENTINEL</h2>

            <p>
                Adversarial AI workplace simulator.
            </p>

            <div class="modal-console">

                <div id="sentinelOutput">

                    🤖 SENTINEL:
                    Tell me about your biggest failure.

                </div>

                <input
                    id="sentinelInput"
                    class="demo-input"
                    placeholder="Type your answer..."
                >

                <button id="sentinelSend">
                    SEND TO AI
                </button>

            </div>
        `
    }

};


/* =====================================================
   OPEN PROJECT MODAL
===================================================== */

const projectCards =
    document.querySelectorAll(
        ".project-card"
    );

projectCards.forEach(
    card => {

        const button =
            card.querySelector(
                ".project-button"
            );

        if (!button) {
            return;
        }

        button.addEventListener(
            "click",
            event => {

                event.stopPropagation();

                const projectName =
                    card.dataset.project;

                openProject(
                    projectName
                );

            }
        );

    }
);


function openProject(name) {

    const project =
        projects[name];

    if (!project) {
        return;
    }

    modalContent.innerHTML =
        project.content;

    projectModal.classList.add(
        "open"
    );

    document.body.style.overflow =
        "hidden";


    /*
        Attach project-specific controls
        AFTER HTML has been inserted.
    */

    if (
        name === "authshield"
    ) {

        const auditButton =
            document.getElementById(
                "runAudit"
            );

        auditButton.addEventListener(
            "click",
            runAudit
        );

    }


    if (
        name === "sentinel"
    ) {

        const sentinelButton =
            document.getElementById(
                "sentinelSend"
            );

        const sentinelInput =
            document.getElementById(
                "sentinelInput"
            );

        sentinelButton.addEventListener(
            "click",
            sendSentinelMessage
        );

        sentinelInput.addEventListener(
            "keydown",
            event => {

                if (
                    event.key ===
                    "Enter"
                ) {

                    sendSentinelMessage();

                }

            }
        );

    }

}


/* =====================================================
   CLOSE MODAL
===================================================== */

function closeProject() {

    projectModal.classList.remove(
        "open"
    );

    document.body.style.overflow =
        "";

}

closeModal.addEventListener(
    "click",
    closeProject
);


projectModal.addEventListener(
    "click",
    event => {

        if (
            event.target ===
            projectModal
        ) {

            closeProject();

        }

    }
);


document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            "Escape"
        ) {

            closeProject();

        }

    }
);


/* =====================================================
   AUTHSHIELD LIVE DEMO
===================================================== */

function runAudit() {

    const button =
        document.getElementById(
            "runAudit"
        );

    const output =
        document.getElementById(
            "auditOutput"
        );

    const target =
        document.getElementById(
            "securityTarget"
        ).value.trim();

    if (!target) {

        output.innerHTML =
            "ERROR: Target is empty.";

        return;

    }

    button.disabled = true;

    output.innerHTML =
        "Initializing scanner...";

    setTimeout(() => {

        output.innerHTML +=
            "<br>Checking authentication...";

    }, 500);

    setTimeout(() => {

        output.innerHTML +=
            "<br>Checking session cookies...";

    }, 1000);

    setTimeout(() => {

        output.innerHTML +=
            "<br>Checking CORS headers...";

    }, 1500);

    setTimeout(() => {

        output.innerHTML +=
            "<br>Checking JWT configuration...";

    }, 2000);

    setTimeout(() => {

        output.innerHTML +=
            "<br><br><strong>✓ AUDIT COMPLETE</strong>";

        button.disabled = false;

    }, 2500);

}


/* =====================================================
   SENTINEL LIVE DEMO
===================================================== */

function sendSentinelMessage() {

    const input =
        document.getElementById(
            "sentinelInput"
        );

    const output =
        document.getElementById(
            "sentinelOutput"
        );

    const value =
        input.value.trim();

    if (!value) {
        return;
    }

    const safeValue =
        escapeHTML(value);

    output.innerHTML +=
        `<br><br>
        🧑 YOU:
        ${safeValue}`;

    input.value = "";

    const replies = [

        "Interesting. Now explain why that was your fault.",

        "That's one strategy.",

        "Your answer has been recorded.",

        "Scenario difficulty increased.",

        "The AI is silently judging your architecture.",

        "Let's make this considerably harder."

    ];

    const reply =
        replies[
            Math.floor(
                Math.random() *
                replies.length
            )
        ];

    setTimeout(() => {

        output.innerHTML +=
            `<br><br>
            🤖 SENTINEL:
            ${reply}`;

    }, 700);

}


/* =====================================================
   HTML ESCAPE
===================================================== */

function escapeHTML(value) {

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        value;

    return element.innerHTML;

}


/* =====================================================
   PIGEON MAIL
===================================================== */

let pigeonSent = false;

sendMail.addEventListener(
    "click",
    () => {

        if (pigeonSent) {
            return;
        }

        pigeonSent = true;

        sendMail.disabled = true;

        sendMail.innerHTML = `
            <span class="mail-icon">
                🕊️
            </span>

            <strong>
                PIGEON DEPLOYED
            </strong>

            <small>
                DELIVERY IN PROGRESS...
            </small>
        `;


        // Aim the bird at the actual mail button so it appears to land on it.
        const mailRect = sendMail.getBoundingClientRect();
        const pigeonWidth = 250;
        const targetX = Math.max(20, Math.min(window.innerWidth - pigeonWidth - 20,
            mailRect.left + mailRect.width * 0.52 - pigeonWidth * 0.50));
        const targetY = Math.max(40, mailRect.top - 118);

        pigeon.style.setProperty("--pigeon-target-x", `${targetX}px`);
        pigeon.style.setProperty("--pigeon-target-y", `${targetY}px`);

        pigeon.classList.remove("fly");
        void pigeon.offsetWidth;
        pigeon.classList.add("fly");


        /*
            Open Outlook after the pigeon
            completes its flight.
        */

        setTimeout(
            () => {

                const subject =
                    encodeURIComponent(
                        "Project / Collaboration Opportunity"
                    );

                const body =
                    encodeURIComponent(
                        "Hi Aditya,\n\nI found your portfolio and would like to discuss a project or collaboration opportunity.\n\n"
                    );

                const outlook =
                    "https://outlook.office.com/mail/deeplink/compose" +
                    "?to=aditya0850%40proton.me" +
                    "&subject=" +
                    subject +
                    "&body=" +
                    body;

                window.location.assign(
                    outlook
                );

            },
            8500
        );

    }
);


/* =====================================================
   CHAOS BUTTON
===================================================== */

chaosButton.addEventListener(
    "click",
    () => {

        document.body.classList.toggle(
            "chaos-mode"
        );

        if (
            document.body.classList.contains(
                "chaos-mode"
            )
        ) {

            chaosButton.textContent =
                "STOP CHAOS";

        } else {

            chaosButton.textContent =
                "CHAOS";

        }

    }
);


/* =====================================================
   PANIC BUTTON
===================================================== */

panicButton.addEventListener(
    "click",
    () => {

        document.body.classList.add(
            "panic-mode"
        );

        const messages = [
            "PANIC",
            "WHY",
            "STOP",
            "AAAAAAAA",
            "SYSTEM UNSTABLE",
            "404 CALM NOT FOUND"
        ];

        let counter = 0;

        const timer =
            setInterval(
                () => {

                    panicButton.textContent =
                        messages[
                            counter %
                            messages.length
                        ];

                    counter++;

                    if (
                        counter >=
                        12
                    ) {

                        clearInterval(
                            timer
                        );

                        document.body.classList.remove(
                            "panic-mode"
                        );

                        panicButton.textContent =
                            "🚨 PANIC";

                    }

                },
                250
            );

    }
);


/* =====================================================
   RANDOM FLOATING EMOJIS
===================================================== */

const emojis = [
    "💻",
    "🕷️",
    "🐛",
    "☕",
    "🚀",
    "🤖",
    "🔥",
    "🧠",
    "⚡"
];

function spawnEmoji() {

    if (
        !app.classList.contains(
            "visible"
        )
    ) {
        return;
    }

    const element =
        document.createElement(
            "div"
        );

    element.textContent =
        emojis[
            Math.floor(
                Math.random() *
                emojis.length
            )
        ];

    element.style.position =
        "fixed";

    element.style.left =
        Math.random() * 100 +
        "vw";

    element.style.top =
        "-50px";

    element.style.fontSize =
        20 +
        Math.random() * 25 +
        "px";

    element.style.zIndex =
        "20";

    element.style.pointerEvents =
        "none";

    element.style.transition =
        "transform 5s linear, opacity 5s linear";

    document.body.appendChild(
        element
    );

    requestAnimationFrame(
        () => {

            element.style.transform =
                `translateY(110vh) rotate(${
                    Math.random() * 720
                }deg)`;

            element.style.opacity =
                "0";

        }
    );

    setTimeout(
        () => {

            element.remove();

        },
        5500
    );

}


/*
    Not too frequent.
*/

setInterval(
    () => {

        if (
            app.classList.contains(
                "visible"
            )
        ) {

            if (
                Math.random() > .5
            ) {

                spawnEmoji();

            }

        }

    },
    3500
);


/* =====================================================
   SECRET KEYBOARD EASTER EGG
===================================================== */

const secretSequence = [

    "ArrowUp",
    "ArrowUp",
    "ArrowDown",
    "ArrowDown",
    "ArrowLeft",
    "ArrowRight",
    "ArrowLeft",
    "ArrowRight"

];

let secretIndex = 0;

document.addEventListener(
    "keydown",
    event => {

        if (
            event.key ===
            secretSequence[secretIndex]
        ) {

            secretIndex++;

            if (
                secretIndex ===
                secretSequence.length
            ) {

                document.body.classList.add(
                    "chaos-mode"
                );

                alert(
                    "🎉 SECRET CHAOS MODE UNLOCKED"
                );

                secretIndex = 0;

            }

        } else {

            secretIndex = 0;

        }

    }
);


/* =====================================================
   INTERSECTION ANIMATIONS
===================================================== */

const animatedElements =
    document.querySelectorAll(
        ".skill-card, .project-card, .meme, .timeline article"
    );


const observer =
    new IntersectionObserver(
        entries => {

            entries.forEach(
                entry => {

                    if (
                        entry.isIntersecting
                    ) {

                        entry.target.style.opacity =
                            "1";

                        entry.target.style.transform =
                            "translateY(0)";

                        observer.unobserve(
                            entry.target
                        );

                    }

                }
            );

        },
        {
            threshold: .1
        }
    );


animatedElements.forEach(
    element => {

        element.style.opacity =
            "0";

        element.style.transform =
            "translateY(35px)";

        element.style.transition =
            "opacity .6s ease, transform .6s cubic-bezier(.16,1,.3,1)";

        observer.observe(
            element
        );

    }
);


/* =====================================================
   CONSOLE EASTER EGG
===================================================== */

console.log(
`
╔══════════════════════════════════════╗
║             ADITYA.exe              ║
║                                      ║
║       YOU OPENED DEVTOOLS.          ║
║                                      ║
║       Respect.                      ║
║                                      ║
║       SYSTEM STATUS: ONLINE         ║
╚══════════════════════════════════════╝
`
);