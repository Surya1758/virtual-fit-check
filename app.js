// SocialStitch AI - Interactive Application Logic

// Garments specs database
const garments = {
    dress: {
        name: "Slim-Fit Silk Dress",
        price: 9999,
        sizes: {
            S: { chest: 32, waist: 26, hips: 34, inseam: 30 },
            M: { chest: 34, waist: 28, hips: 36, inseam: 31 },
            L: { chest: 37, waist: 31, hips: 39, inseam: 32 },
            XL: { chest: 40, waist: 34, hips: 42, inseam: 33 }
        }
    },
    hoodie: {
        name: "Comfort Cotton Hoodie",
        price: 4999,
        sizes: {
            S: { chest: 38, waist: 36, hips: 38, inseam: 29 },
            M: { chest: 42, waist: 40, hips: 42, inseam: 30 },
            L: { chest: 46, waist: 44, hips: 46, inseam: 31 },
            XL: { chest: 50, waist: 48, hips: 50, inseam: 32 }
        }
    },
    chinos: {
        name: "Tailored Chinos Pants",
        price: 5999,
        sizes: {
            S: { chest: 30, waist: 28, hips: 34, inseam: 30 }, // chest represents rise or waist support
            M: { chest: 32, waist: 30, hips: 36, inseam: 31 },
            L: { chest: 34, waist: 32, hips: 38, inseam: 32 },
            XL: { chest: 36, waist: 34, hips: 40, inseam: 33 }
        }
    }
};

const dimensionLabels = {
    dress: { chest: "Chest", waist: "Waist", hips: "Hips" },
    hoodie: { chest: "Chest", waist: "Waist", hips: "Hips" },
    chinos: { chest: "Rise Size", waist: "Waist", hips: "Hips" }
};

// UGC synthetic model slides mapping



// User Personas Data
const personas = [
    {
        name: "Anjali Mehta",
        age: 38,
        role: "CEO & Founder, UrbanThread",
        quote: "Returns are eating my margins alive, and my warehouse is overflowing with opened inventory.",
        image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300",
        pains: [
            "High Cash on Delivery (COD) volume leads to 35% doorstep rejection (RTO).",
            "Return logistics cost over ₹15 lakh monthly in courier and inspection fees.",
            "Sizing discrepancies across factories drive constant size-related returns."
        ],
        path: [
            "Integrates SocialStitch VFC onto her Shopify store via standard Javascript snippet.",
            "The parametric engine auto-selects the size, boosting sizing confidence.",
            "RTO rates drop by 25%, resulting in lakhs of rupees in immediate monthly savings."
        ]
    },
    {
        name: "Liam Carter",
        age: 22,
        role: "Student & Streetwear Enthusiast",
        quote: "I have no idea if a Medium fits me anymore. I just buy S, M, and L and send the rejects back.",
        image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=300",
        pains: [
            "Frustrated by inconsistent sizing charts across online boutique brands.",
            "Hates reading numeric shoulder/waist size specs in detail pages.",
            "Admits to bracketing (buying 3 sizes) because returns are free anyway."
        ],
        path: [
            "Clicks the pulsing 'See it on You' icon on the product page.",
            "Quickly inputs height/weight and sees a dynamic 3D mannequin representing his build.",
            "Learns Small is too tight in shoulders and buys Medium directly, eliminating the bracket order."
        ]
    },
    {
        name: "Priya Sharma",
        age: 29,
        role: "Corporate Marketing Manager",
        quote: "If the package arrives and I have any doubt about the fit or fabric quality, I just decline it at the door.",
        image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=300",
        pains: [
            "Burned by 'Instagram vs. Reality' fabric quality mismatches previously.",
            "Reluctant to pay upfront for clothing that might sit awkwardly on her curves.",
            "Frequently refuses deliveries at the door out of fit anxiety."
        ],
        path: [
            "Views the jacket on style models sharing her exact curvy frame in the carousel.",
            "Swipes to slide 5 to review the simulated macro knit fabric weave details.",
            "Feels confident in quality/fit, completes transaction, and keeps the purchase."
        ]
    }
];

// Active State Variables
let activeGarment = 'dress';
let activeSize = 'M';
let userHeight = 165;
let userChest = 34;
let userWaist = 28;
let userHips = 36;
let showTension = true;


// Dynamic calculations of size scores
function computeFitScores() {
    const garmentSpec = garments[activeGarment];
    const scores = {};

    Object.keys(garmentSpec.sizes).forEach(size => {
        const specs = garmentSpec.sizes[size];
        
        // Calculate differences
        const dChest = specs.chest - userChest;
        const dWaist = specs.waist - userWaist;
        const dHips = specs.hips - userHips;

        // Score each dimension
        // Penalty is heavier for tight fit (diff < 0) than loose fit (diff > 0)
        const getScore = (diff, base) => {
            if (diff < 0) {
                // Too tight
                const ratio = Math.abs(diff) / base;
                return Math.max(0, 1 - ratio * 4.5);
            } else {
                // Too loose
                const ratio = diff / base;
                return Math.max(0.5, 1 - ratio * 1.5);
            }
        };

        const chestScore = getScore(dChest, userChest);
        const waistScore = getScore(dWaist, userWaist);
        const hipsScore = getScore(dHips, userHips);

        // Average score
        const averageScore = (chestScore + waistScore + hipsScore) / 3;
        scores[size] = Math.round(averageScore * 100);
    });

    return scores;
}

function getOptimalSize(scores) {
    let bestSize = 'M';
    let maxScore = -1;
    
    Object.keys(scores).forEach(size => {
        if (scores[size] > maxScore) {
            maxScore = scores[size];
            bestSize = size;
        }
    });

    return bestSize;
}

function updateTrialSuite() {
    const specs = garments[activeGarment].sizes[activeSize];
    const scores = computeFitScores();
    const optimalSize = getOptimalSize(scores);
    const optimalScore = scores[optimalSize];
    
    // Inferred body shape type based on dimensions
    const hipRatio = userWaist / userHips;
    let inferredShape = 'athletic';
    if (hipRatio < 0.73) {
        inferredShape = 'curvy';
    } else if (userHips < 34.5 && userHeight < 162) {
        inferredShape = 'petite';
    }

    // 1. Update active names & prices
    document.getElementById('active-garment-name').textContent = garments[activeGarment].name;
    const priceText = `₹${garments[activeGarment].price.toLocaleString('en-IN')}`;
    document.querySelector('.trial-diagnostics-panel .product-price').textContent = priceText;

    // 2. Render Mannequin Shape dynamically (morph path)
    const baseShoulder = 40 * (userChest / 34);
    const baseWaist = 30 * (userWaist / 28);
    const baseHips = 25 * (userHips / 36);

    const torsoPathString = `M ${100 - baseShoulder},85 
                             C 80,85 120,85 ${100 + baseShoulder},85 
                             C ${100 + baseShoulder + 4},115 ${100 + baseWaist + 4},155 ${100 + baseWaist},210 
                             C ${100 + baseWaist - 4},230 ${100 + baseHips + 4},250 ${100 + baseHips},270 
                             L ${100 - baseHips},270 
                             C ${100 - baseHips - 4},250 ${100 - baseWaist + 4},230 ${100 - baseWaist},210 
                             C ${100 - baseWaist - 4},155 ${100 - baseShoulder - 4},115 ${100 - baseShoulder},85 Z`;

    const mannequinTorso = document.getElementById('mannequin-torso');
    mannequinTorso.setAttribute('d', torsoPathString);

    // Apply scaling to other body parts for proportions
    document.getElementById('mannequin-l-arm').setAttribute('d', `M ${100 - baseShoulder},85 Q ${100 - baseShoulder - 20},140 ${100 - baseShoulder - 15},200`);
    document.getElementById('mannequin-r-arm').setAttribute('d', `M ${100 + baseShoulder},85 Q ${100 + baseShoulder + 20},140 ${100 + baseShoulder + 15},200`);
    document.getElementById('mannequin-l-leg').setAttribute('d', `M ${100 - baseHips + 5},270 Q 75,330 80,380`);
    document.getElementById('mannequin-r-leg').setAttribute('d', `M ${100 + baseHips - 5},270 Q 125,330 120,380`);

    // 3. Update Heatmap colors based on sizing differences (Tension check)
    const updateZoneColor = (zoneElement, diff) => {
        if (!showTension) {
            zoneElement.setAttribute('fill', 'rgba(255,255,255,0.05)');
            return;
        }
        if (diff < 0) {
            // Tight
            const intensity = Math.min(0.95, 0.4 + Math.abs(diff) * 0.15);
            zoneElement.setAttribute('fill', `rgba(239, 68, 68, ${intensity})`); // red
        } else if (diff <= 2) {
            // Optimal
            zoneElement.setAttribute('fill', 'rgba(16, 185, 129, 0.45)'); // green
        } else {
            // Loose
            const intensity = Math.min(0.7, 0.3 + (diff - 2) * 0.08);
            zoneElement.setAttribute('fill', `rgba(6, 182, 212, ${intensity})`); // cyan loose
        }
    };

    const diffChest = specs.chest - userChest;
    const diffWaist = specs.waist - userWaist;
    const diffHips = specs.hips - userHips;

    updateZoneColor(document.getElementById('zone-chest'), diffChest);
    updateZoneColor(document.getElementById('zone-hips'), diffHips);

    // 4. Set Fit Pill and diagnostics card
    const activeScore = scores[activeSize];
    const fitPillElement = document.getElementById('trial-fit-pill');
    
    // Fit status definitions
    let verdictStatus = 'WILL FIT';
    let statusClass = 'green';
    let descDetails = 'Optimized fabric tension. Fabric stretches comfortably and conforms to your body curves.';

    if (activeScore >= 85) {
        fitPillElement.style.background = 'var(--success)';
        fitPillElement.textContent = `Best Fit: Size ${activeSize} (${activeScore}% Match)`;
        verdictStatus = 'OPTIMAL FIT';
        statusClass = 'green';
    } else if (activeScore >= 68) {
        fitPillElement.style.background = 'var(--warning)';
        fitPillElement.textContent = `Loose Fit: Size ${activeSize} (${activeScore}% Match)`;
        verdictStatus = 'LOOSE FIT';
        statusClass = 'orange';
        descDetails = 'Excess fabric surplus in certain areas. Good if you prefer a boxy/oversized styling silhouette.';
    } else {
        fitPillElement.style.background = 'var(--danger)';
        fitPillElement.textContent = `Tight Fit: Size ${activeSize} (${activeScore}% Match)`;
        verdictStatus = 'DOES NOT FIT';
        statusClass = 'red';
        descDetails = 'Warning: Fabric stretch is at limit. Certain movement ranges will feel tight and compress shoulders/waist.';
    }

    document.getElementById('verdict-status-txt').textContent = verdictStatus;
    document.getElementById('verdict-status-txt').className = `verdict-status ${statusClass}`;
    document.getElementById('verdict-match-pct').textContent = `${activeScore}% Match Score`;
    document.getElementById('verdict-detail-desc').textContent = descDetails;

    // 5. Render Size Buttons with Recommendations
    const sizeContainer = document.getElementById('trial-sizes-container');
    sizeContainer.innerHTML = '';
    
    Object.keys(garments[activeGarment].sizes).forEach(size => {
        const isRecommended = (size === optimalSize);
        const isActive = (size === activeSize);
        
        const btn = document.createElement('button');
        btn.className = `trial-size-btn ${isActive ? 'active' : ''} ${isRecommended ? 'recommended-badge' : ''}`;
        btn.textContent = size;
        btn.title = isRecommended ? "SocialStitch AI Recommendation" : "";
        btn.onclick = () => selectTrialSize(size);
        sizeContainer.appendChild(btn);
    });

    // 6. Populate Comparison Table
    const tableBody = document.getElementById('dimension-table-body');
    tableBody.innerHTML = '';

    const createTableRow = (label, userVal, garmentVal, diff) => {
        let statusText = 'Fits';
        let classColor = 'green';
        if (diff < 0) {
            statusText = 'Tight';
            classColor = 'red';
        } else if (diff > 2.5) {
            statusText = 'Loose';
            classColor = 'orange';
        }

        return `
            <tr>
                <td><strong>${label}</strong></td>
                <td>${userVal}"</td>
                <td>${garmentVal}"</td>
                <td><span class="dim-status ${classColor}">${statusText}</span></td>
            </tr>
        `;
    };

    const labels = dimensionLabels[activeGarment];
    tableBody.innerHTML += createTableRow(labels.chest, userChest, specs.chest, diffChest);
    tableBody.innerHTML += createTableRow(labels.waist, userWaist, specs.waist, diffWaist);
    tableBody.innerHTML += createTableRow(labels.hips, userHips, specs.hips, diffHips);

    // 7. Update Add to Cart Button Text
    const addToCartBtn = document.getElementById('trial-add-to-cart');
    addToCartBtn.innerHTML = `<i class="fa-solid fa-bag-shopping"></i> Add Pre-Selected Size ${optimalSize} to Bag`;

    // 8. Update UGC Carousel based on inferred shape
    triggerAIGenerator();
}

function selectGarment(type) {
    activeGarment = type;
    const garmentsList = ['dress', 'hoodie', 'chinos'];
    garmentsList.forEach(g => {
        const card = document.querySelector(`.garment-card[onclick="selectGarment('${g}')"]`);
        if (g === type) card.classList.add('active');
        else card.classList.remove('active');
    });

    // Reset size to optimal recommendation on garment change
    const scores = computeFitScores();
    activeSize = getOptimalSize(scores);
    
    updateTrialSuite();
}

function selectTrialSize(size) {
    activeSize = size;
    updateTrialSuite();
}

function updateBodyDimensions() {
    userHeight = parseInt(document.getElementById('input-body-height').value);
    userChest = parseInt(document.getElementById('input-body-chest').value);
    userWaist = parseInt(document.getElementById('input-body-waist').value);
    userHips = parseInt(document.getElementById('input-body-hips').value);

    // Update value text readouts
    document.getElementById('val-body-height').textContent = `${userHeight} cm`;
    document.getElementById('val-body-chest').textContent = `${userChest} inches`;
    document.getElementById('val-body-waist').textContent = `${userWaist} inches`;
    document.getElementById('val-body-hips').textContent = `${userHips} inches`;

    // Recompute sizes
    const scores = computeFitScores();
    activeSize = getOptimalSize(scores); // Auto-jump to new optimal size as measurements adjust

    updateTrialSuite();
}

function resetToAverage() {
    document.getElementById('input-body-height').value = 165;
    document.getElementById('input-body-chest').value = 34;
    document.getElementById('input-body-waist').value = 28;
    document.getElementById('input-body-hips').value = 36;
    
    updateBodyDimensions();
}

function toggleTensionView() {
    showTension = document.getElementById('toggle-tension').checked;
    updateTrialSuite();
}

let isGeneratingUgc = false;

function triggerAIGenerator() {
    const hipRatio = userWaist / userHips;
    let shape = 'athletic';
    if (hipRatio < 0.73) {
        shape = 'curvy';
    } else if (userHips < 34.5 && userHeight < 162) {
        shape = 'petite';
    }

    if (isGeneratingUgc) return;
    isGeneratingUgc = true;

    const logsContainer = document.getElementById('terminal-logs');
    const progressBarFill = document.getElementById('progress-bar-fill');
    const genStatusText = document.getElementById('gen-status-text');
    const genPctText = document.getElementById('gen-pct-text');
    
    genStatusText.classList.add('active');
    genStatusText.textContent = "RENDERING...";

    // Update pipeline data tags with current user dimensions
    const bodyTag = document.getElementById('pipeline-tag-body');
    const garmentTag = document.getElementById('pipeline-tag-garment');
    const outputTag = document.getElementById('pipeline-tag-output');
    const garmentName = garments[activeGarment].name;
    const chest = Math.round(userWaist * 1.2);

    if (bodyTag) bodyTag.textContent = `H: ${userHeight}cm • C: ${chest}" • W: ${userWaist}" • H: ${userHips}"`;
    if (garmentTag) garmentTag.textContent = `Garment: ${garmentName} • Size ${activeSize}`;

    // Clear terminal and print log steps
    logsContainer.innerHTML = '';
    progressBarFill.style.width = '0%';
    genPctText.textContent = '0%';

    const logs = [
        { pct: 15, msg: `[SocialStitch-GPU] Launching diffusion pipeline (IDM-VTON v2.1)...` },
        { pct: 40, msg: `[SocialStitch-GPU] Encoding SMPL mesh: H:${userHeight}cm | W:${userWaist}" | Hip:${userHips}" [OK]` },
        { pct: 70, msg: `[SocialStitch-GPU] Warping garment onto ${shape} avatar for size ${activeSize} [OK]` },
        { pct: 90, msg: `[SocialStitch-GPU] Denoising latents (Steps 20/20) [||||||||||||||||||||] 100%` },
        { pct: 100, msg: `[SocialStitch-GPU] Synthesis Complete. 3 UGC variants generated.` }
    ];

    let currentLogIndex = 0;

    function runLogStep() {
        if (currentLogIndex >= logs.length) {
            setTimeout(() => {
                isGeneratingUgc = false;
                genStatusText.classList.remove('active');
                genStatusText.textContent = "IDLE";
                if (outputTag) outputTag.textContent = `Output: 3 style variants • ${shape === 'curvy' ? '98' : shape === 'petite' ? '97' : '96'}% body overlap`;
            }, 200);
            return;
        }

        const step = logs[currentLogIndex];
        const line = document.createElement('div');
        line.textContent = step.msg;
        logsContainer.appendChild(line);
        logsContainer.scrollTop = logsContainer.scrollHeight;

        progressBarFill.style.width = `${step.pct}%`;
        genPctText.textContent = `${step.pct}%`;

        currentLogIndex++;
        setTimeout(runLogStep, 250);
    }

    runLogStep();
}



// 3. User Personas switcher
function switchPersona(index) {
    const p = personas[index];
    const tabs = document.querySelectorAll('.tab-btn');
    tabs.forEach((tab, idx) => {
        if (idx === index) tab.classList.add('active');
        else tab.classList.remove('active');
    });

    const content = document.getElementById('persona-content');
    content.innerHTML = `
        <div class="persona-card">
            <div class="persona-avatar-col">
                <div class="persona-img-circle">
                    <img src="${p.image}" alt="${p.name}">
                </div>
                <h4>${p.name}, ${p.age}</h4>
                <div class="persona-role">${p.role}</div>
            </div>
            <div class="persona-details-col">
                <blockquote>"${p.quote}"</blockquote>
                <div class="persona-subgrid">
                    <div class="persona-pain-points">
                        <h5><i class="fa-solid fa-circle-xmark"></i> Core Pain Points</h5>
                        <ul>
                            ${p.pains.map(pain => `<li>${pain}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="persona-value-path">
                        <h5><i class="fa-solid fa-circle-check"></i> SocialStitch Value Path</h5>
                        <ul>
                            ${p.path.map(step => `<li>${step}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// 4. Business ROI Calculator Logic
function calculateROI() {
    const orders = parseFloat(document.getElementById('input-orders').value);
    const aov = parseFloat(document.getElementById('input-aov').value);
    const returnRate = parseFloat(document.getElementById('input-return').value) / 100;
    const costPerReturn = parseFloat(document.getElementById('input-cost-return').value);

    // Update Slider text readouts
    document.getElementById('val-orders').textContent = Number(orders).toLocaleString();
    document.getElementById('val-aov').textContent = `₹${aov.toLocaleString('en-IN')}`;
    document.getElementById('val-return').textContent = `${Math.round(returnRate * 100)}%`;
    document.getElementById('val-cost-return').textContent = `₹${costPerReturn.toLocaleString('en-IN')}`;

    // Math
    const baselineReturns = orders * returnRate;
    const logisticsSavings = baselineReturns * 0.25 * costPerReturn; // 25% returns reduction
    const newRevenue = orders * 0.15 * aov; // 15% conversion lift
    const netMarginOnRevenue = newRevenue * 0.20; // 20% Net margin

    const grossValueCreated = logisticsSavings + netMarginOnRevenue;
    const sessions = orders * 4;
    const gpuCost = sessions * 8; // ₹8 per session

    const netMonthlyRoi = grossValueCreated - gpuCost;
    const annualizedBenefit = netMonthlyRoi * 12;

    // Update outputs in HTML
    document.getElementById('out-returns-savings').textContent = `₹${Math.round(logisticsSavings).toLocaleString('en-IN')}`;
    document.getElementById('out-conversion-margin').textContent = `₹${Math.round(netMarginOnRevenue).toLocaleString('en-IN')}`;
    document.getElementById('out-gross-benefit').textContent = `₹${Math.round(grossValueCreated).toLocaleString('en-IN')}`;
    document.getElementById('out-gpu-cost').textContent = `₹${Math.round(gpuCost).toLocaleString('en-IN')}`;
    
    const roiElement = document.getElementById('out-net-roi');
    if (netMonthlyRoi > 0) {
        roiElement.textContent = `₹${Math.round(netMonthlyRoi).toLocaleString('en-IN')}`;
        roiElement.className = "net-val green-text";
    } else {
        roiElement.textContent = `-₹${Math.abs(Math.round(netMonthlyRoi)).toLocaleString('en-IN')}`;
        roiElement.className = "net-val red-text";
    }

    const annualInCr = (annualizedBenefit / 10000000).toFixed(2);
    document.getElementById('out-annual-roi').textContent = `Annual Benefit: ~₹${annualInCr} Cr`;
}

// 5. Drawer & Alert Toast triggers
function triggerTrialAddToCart() {
    const scores = computeFitScores();
    const optimalSize = getOptimalSize(scores);
    const garmentName = garments[activeGarment].name;
    const priceText = `₹${garments[activeGarment].price.toLocaleString('en-IN')}`;

    // Update Cart Modal Elements
    document.getElementById('cart-product-title').textContent = garmentName;
    document.getElementById('cart-product-price').textContent = priceText;
    document.getElementById('cart-item-desc').textContent = `Size: ${optimalSize} (Auto-calculated optimal fit)`;

    // Trigger toast
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toast-message');
    toastMsg.textContent = `${garmentName} (Size ${optimalSize}) added to bag!`;
    toast.classList.add('active');

    setTimeout(() => {
        toast.classList.remove('active');
        toggleCart(true); // Open the drawer
    }, 1500);
}

function toggleCart(forceOpen = false) {
    const drawer = document.getElementById('cart-drawer');
    const overlay = document.getElementById('cart-overlay');
    
    if (forceOpen || !drawer.classList.contains('open')) {
        drawer.classList.add('open');
        overlay.classList.add('open');
    } else {
        drawer.classList.remove('open');
        overlay.classList.remove('open');
    }
}

function toggleBlueprint(view) {
    const viewUs = document.getElementById('blueprint-view-us');
    const viewClient = document.getElementById('blueprint-view-client');
    const btnUs = document.getElementById('btn-blueprint-us');
    const btnClient = document.getElementById('btn-blueprint-client');

    if (view === 'us') {
        viewUs.classList.add('active');
        viewClient.classList.remove('active');
        btnUs.classList.add('active');
        btnClient.classList.remove('active');
    } else {
        viewUs.classList.remove('active');
        viewClient.classList.add('active');
        btnUs.classList.remove('active');
        btnClient.classList.add('active');
    }
}

// Initialization on Page Load
window.onload = function() {
    // Show first persona profile
    switchPersona(0);
    // Initialize Fitting Room
    updateTrialSuite();
    // Initialize ROI Calculator values
    calculateROI();
};
