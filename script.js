document.addEventListener("DOMContentLoaded", () => {
    const bingoBoard = document.getElementById("bingo-board");
    const cells = [];
    let hasRedMarker = false;
    let cellCounter = 1;
    let toggledCells = []; // Array to keep track of toggled cell numbers

    // Define the winning combinations for horizontal, vertical, and full house bingos
const horizontalBingos = [
[1, 2, 3, 4, 5],
[6, 7, 8, 9, 10],
[11, 12, 13, 14, 15],
[16, 17, 18, 19, 20],
[21, 22, 23, 24, 25]
];

const verticalBingos = [
[1, 6, 11, 16, 21],
[2, 7, 12, 17, 22],
[3, 8, 13, 18, 23],
[4, 9, 14, 19, 24],
[5, 10, 15, 20, 25]
];

const fullHouse = [
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25],
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]
];

    // Define the configurations as arrays
    const configs = {
        reactions: [
            "Boring (Free Space)", "Being Silent", "Fake Laughing", "Terrible Thumbnail", "All Caps Title",
            "Reacting To YTPs Of Himself", "Weird Breathing", "Weird Behaviour", "Moaning About Mattel", 'Looking At The Camera While Doing An "Unamused" Face',
            "Contributing Nothing", "Begging For Engagement", "Unnecessary Sound Effects", "Yelling For No Reason", "Incomprehensible Noises",
            "Playing A Whole Video Uninterrupted For Most Of The Video", "Selling His Shitty Merch", "Wearing His Shitty Merch", "Dead Memes", "Terrible Intro",
            "Weird Tangent About Literally Nothing Of Interest", "Awful Filters", "Excessive Zooming In", "Getting Upset Over Nothing", "Video He Is Reacting To Is Also Terrible",
            "Unexciting Intro","Doing Literally Nothing Other Than Sitting","Stupid Subtitles",'"Oh, nooo"','"Whut??!!1"',
            '"Wooow"',"Being Onto Something Then Stops Talking","Overdoing Fake Laughing","Blowjob Mouth","Smile That Slowly Turns Into Depression",
            "Pausing Just To Say Something That Makes No Sense","The Video Is Better Than Joe","His Moderators Are Most Of His Channel Members","Talking While Being Onto Absolutely Nothing","Unnecessary Graphics",
            "Copying Something Slightly Funny In The Video","Ignoring Copyright Laws","Slow Motion Effect","Doesn't Even Know What He Is Reacting To","Reacting To Himself",
            "Watching Something Related To A Children's Show","Getting Upset Over Childish Matters"//,"","",""
        ],
        config2: [
            "Config 2 - 1", "Config 2 - 2", "Config 2 - 3", "Config 2 - 4", "Config 2 - 5",
            "Config 2 - 6", "Config 2 - 7", "Config 2 - 8", "Config 2 - 9", "Config 2 - 10",
            "Config 2 - 11", "Config 2 - 12", "Config 2 - 13", "Config 2 - 14", "Config 2 - 15",
            "Config 2 - 16", "Config 2 - 17", "Config 2 - 18", "Config 2 - 19", "Config 2 - 20",
            "Config 2 - 21", "Config 2 - 22", "Config 2 - 23", "Config 2 - 24", "Config 2 - 25"
        ],
        config3: [
            "Config 3 - 1", "Config 3 - 2", "Config 3 - 3", "Config 3 - 4", "Config 3 - 5",
            "Config 3 - 6", "Config 3 - 7", "Config 3 - 8", "Config 3 - 9", "Config 3 - 10",
            "Config 3 - 11", "Config 3 - 12", "Config 3 - 13", "Config 3 - 14", "Config 3 - 15",
            "Config 3 - 16", "Config 3 - 17", "Config 3 - 18", "Config 3 - 19", "Config 3 - 20",
            "Config 3 - 21", "Config 3 - 22", "Config 3 - 23", "Config 3 - 24", "Config 3 - 25"
        ],
    };

    // Function to generate a random number between 1 and 99 for the seed
    function generateRandomSeed() {
        const seed = Math.floor(Math.random() * 99) + 1;
        Math.seedrandom(seed);
        return seed;
    }

    // Function to create the Bingo board grid
    function createBoard(labels) {
        bingoBoard.innerHTML = ""; // Clear previous board
        hasRedMarker = false;
        let cellCounter = 1;

        // Shuffle the labels randomly (excluding the first label for the free space)
        const shuffledLabels = labels.slice(1);
        for (let i = shuffledLabels.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledLabels[i], shuffledLabels[j]] = [shuffledLabels[j], shuffledLabels[i]];
        }

        // Calculate the max label length
        const maxLabelLength = Math.max(...labels.map(label => label.length));

        // Calculate the appropriate font size based on the label length
        const baseFontSize = 16; // Default font size
        const maxCellWidth = 550; // Maximum cell width in pixels
        const fontSize = Math.min(baseFontSize, maxCellWidth / maxLabelLength);

        // Add the cells to the board
        for (let row = 0; row < 5; row++) {
            for (let col = 0; col < 5; col++) {
                const cell = document.createElement("div");
                cell.classList.add("bingo-cell");
                const labelElement = document.createElement("div");
                labelElement.classList.add("bingo-cell-label"); // Apply the new class
                let label = "";
                if (row === 2 && col === 2) {
                    // Set the Free Space label
                    label = labels[0] || "";
                    cell.classList.add("free-space");
                } else {
                    // Use the shuffled labels for the rest of the cells
                    label = shuffledLabels.pop() || "";
                }
                // Set the font size for the label
                labelElement.style.fontSize = `${fontSize}px`;

                labelElement.textContent = label;
                cell.appendChild(labelElement);
                cell.setAttribute("data-cell-number", cellCounter);
                cellCounter++;

                cell.addEventListener("click", () => toggleCell(cell));
                bingoBoard.appendChild(cell);
                cells.push(cell);
            }
        }
        checkBingo()
    }

    // Function to toggle the active state of the cell
    function toggleCell(cell) {
        cell.classList.toggle("active");
        hasRedMarker = cells.some((cell) => cell.classList.contains("active"));

        const cellNumber = parseInt(cell.getAttribute("data-cell-number"));

        // Check if the cell is active and add/remove it from the toggledCells array
        if (cell.classList.contains("active")) {
            toggledCells.push(cellNumber);
        } else {
            const index = toggledCells.indexOf(cellNumber);
            if (index !== -1) {
                toggledCells.splice(index, 1);
            }
        }
        checkBingo()
    }

    function checkBingo() {
        const verticalBingo = verticalBingos.some((bingo) => bingo.every((number) => toggledCells.includes(number)));
        const horizontalBingo = horizontalBingos.some((bingo) => bingo.every((number) => toggledCells.includes(number)));
        const fullHouseBingo = fullHouse.every((bingo) => bingo.every((number) => toggledCells.includes(number)));
    
        const bingoLabel = document.getElementById("bingo-label");
        if (fullHouseBingo) {
            bingoLabel.textContent = "BINGO: FULL HOUSE!";
            bingoBoard.classList.add("bingo"); // Add class for full house bingo
        } else if (verticalBingo && horizontalBingo) {
            bingoLabel.textContent = "BINGO: VERTICAL AND HORIZONTAL!";
        } else if (verticalBingo) {
            bingoLabel.textContent = "BINGO: VERTICAL!";
            // Add class to each cell in the vertical bingo row for the 3D spin effect
            for (const bingo of verticalBingos) {
                if (bingo.every((number) => toggledCells.includes(number))) {
                    for (const number of bingo) {
                        const cellElement = document.querySelector(`[data-cell-number="${number}"]`);
                        cellElement.classList.add("bingo-row");
                    }
                }
            }
        } else if (horizontalBingo) {
            bingoLabel.textContent = "BINGO: HORIZONTAL!";
            // Add class to each cell in the horizontal bingo row for the 3D spin effect
            for (const bingo of horizontalBingos) {
                if (bingo.every((number) => toggledCells.includes(number))) {
                    for (const number of bingo) {
                        const cellElement = document.querySelector(`[data-cell-number="${number}"]`);
                        cellElement.classList.add("bingo-row");
                    }
                }
            }
        } else {
            bingoLabel.textContent = "Keep going!";
        }
    }

    // Function to export the Bingo board as PNG
    function exportAsPNG() {
        const gridContainer = document.querySelector(".grid-container");
        domtoimage.toPng(gridContainer)
            .then((dataUrl) => {
                const link = document.createElement("a");
                link.download = "bingo.png";
                link.href = dataUrl;
                link.click();
            })
            .catch((error) => {
                console.error("Error exporting as PNG:", error);
            });
    }

    // Function to save the selected configuration to localStorage
    function saveConfig(config) {
        localStorage.setItem("selectedConfig", config);
        // Update the current config label based on the saved config
        const currentConfigLabel = document.getElementById("config-label");
        const selectedConfig = loadConfig();
        currentConfigLabel.textContent = `Current Config: ${selectedConfig}`;
        document.getElementById("generate").click();
    }

    // Function to load the selected configuration from localStorage
    function loadConfig() {
        return localStorage.getItem("selectedConfig") || "reactions";
    }

    // Function to save the seed to localStorage
    function saveSeed(seed) {
        localStorage.setItem("seed", seed);
    }

    // Function to load the seed from localStorage or generate a new random seed
    function loadSeed() {
        return document.getElementById("seed").value.trim();
    }

    // Handle click events for each configuration button
    document.getElementById("config1").addEventListener("click", () => {
        saveConfig("reactions");
    });

    document.getElementById("config2").addEventListener("click", () => {
        saveConfig("config2");
    });

    document.getElementById("config3").addEventListener("click", () => {
        saveConfig("config3");
    });


    document.getElementById("generaternd").addEventListener("click", () => {
        // Load a random seed into the seed input field on page load
        document.getElementById("seed").value = generateRandomSeed();
        document.getElementById("generate").click();
    });

    document.getElementById("generate").addEventListener("click", () => {
        if (hasRedMarker) {
            const confirmRegenerate = confirm("Are you sure you want to regenerate? This will clear red markers.");
            if (!confirmRegenerate) {
                return;
            }
        }
        const seed = loadSeed();
        saveSeed(seed);
        Math.seedrandom(seed); // Seed the random number generator
        console.log(seed);
        const selectedConfig = loadConfig();
        createBoard(configs[selectedConfig]);
    });

    document.getElementById("export").addEventListener("click", exportAsPNG);

    // Set the initial configuration to Config 1 on page load
    document.getElementById("config1").click();
    document.getElementById("generaternd").click();

});
