// backend/seed.js
// Run: node seed.js
// Populates the database with sample posts for development

require('dotenv').config()
const mongoose = require('mongoose')
const Post = require('./models/Post')

const SAMPLE_POSTS = [
  {
    title: 'NATO Expands Eastern Flank: New Rapid Reaction Force Deployed to Baltic States',
    category: 'Defence',
    content: `<p>NATO has announced the deployment of an expanded rapid reaction force to the Baltic states, marking the most significant reinforcement of the alliance's eastern flank since the Cold War. The move comes amid heightened tensions following a series of provocative manoeuvres near Estonian and Latvian airspace.</p>
    <h2>Strategic Implications</h2>
    <p>The deployment signals a fundamental shift in NATO's deterrence posture — moving from a "tripwire" presence to a genuine forward defence capable of holding ground without immediate reinforcement from western Europe.</p>
    <p>Military analysts note that the new force structure includes pre-positioned heavy armour, integrated air defence systems, and forward-deployed logistics chains designed to sustain a 30-day independent combat operation.</p>
    <h2>Russian Response</h2>
    <p>Moscow has condemned the deployment as "provocative escalation," while simultaneously conducting its own large-scale snap exercises along the border with Finland. The dual signalling suggests a deliberate strategy of matched escalation designed to test alliance cohesion.</p>`,
    tags: ['NATO', 'Russia', 'Baltic', 'Defence'],
    aiSummary: 'NATO\'s expanded Baltic deployment represents a structural shift from symbolic deterrence to credible forward defence, raising the threshold for Russian miscalculation while risking a cycle of matched escalation along the alliance\'s eastern perimeter.',
  },
  {
    title: 'China\'s Cyber Command Doctrine: Inside the PLA\'s Information Warfare Strategy',
    category: 'Tech Warfare',
    content: `<p>Declassified assessments and open-source intelligence have revealed significant details about China's evolving cyber warfare doctrine, which has shifted from opportunistic espionage toward integrated warfighting capabilities designed to blind adversaries in the opening hours of a conflict.</p>
    <h2>The "System Destruction" Doctrine</h2>
    <p>PLA doctrine now centres on what Chinese military theorists call "system destruction warfare" — the systematic dismantling of an adversary's command, control, and logistics networks before a single conventional shot is fired. Cyber capabilities are considered a first-strike tool, not a supporting instrument.</p>
    <h2>Critical Infrastructure Targeting</h2>
    <p>Recent penetrations of US power grid control systems and water treatment facilities are assessed as pre-positioned access for potential wartime use, rather than immediate sabotage operations. The distinction matters enormously for deterrence strategy.</p>`,
    tags: ['China', 'Cyber', 'PLA', 'USA'],
    aiSummary: 'China\'s cyber doctrine has evolved into a pre-emptive first-strike framework targeting critical infrastructure, fundamentally challenging the assumption that cyber operations are a secondary or coercive tool rather than a warfighting instrument.',
  },
  {
    title: 'The Drone Revolution: How Autonomous Systems Are Rewriting Ground Warfare',
    category: 'Tech Warfare',
    content: `<p>The battlefields of the 21st century have become proving grounds for autonomous weapons systems at a pace that has outstripped military doctrine, legal frameworks, and strategic theory. What began as remote-controlled surveillance platforms has evolved into a complex ecosystem of loitering munitions, swarm systems, and AI-aided targeting.</p>
    <h2>Tactical Lessons from Recent Conflicts</h2>
    <p>Sustained combat operations have demonstrated that first-person-view (FPV) drones costing under $500 can effectively neutralise armoured vehicles worth millions. The cost-exchange ratio fundamentally undermines traditional armour-heavy doctrine and forces a complete reconceptualisation of combined arms warfare.</p>
    <h2>Counter-Drone Systems Race</h2>
    <p>Electronic warfare, laser systems, and kinetic interceptors are being fielded at unprecedented speed. But the asymmetry remains — neutralising a $400 drone with a $100,000 missile is economically unsustainable at scale, pushing investment toward soft-kill systems and AI-powered threat discrimination.</p>`,
    tags: ['Drones', 'Autonomous', 'Ukraine', 'Tech Warfare'],
    aiSummary: 'Autonomous drone systems have created a fundamental cost-exchange asymmetry in ground warfare, forcing a doctrinal rethink of armour, logistics, and combined arms operations that established military powers have yet to fully address.',
  },
  {
    title: 'Strait Calculus: The Strategic Logic Behind Taiwan Contingency Planning',
    category: 'Geopolitics',
    content: `<p>The Taiwan Strait remains the most volatile flashpoint in the Indo-Pacific, where the interests of four major powers — China, the United States, Japan, and Taiwan itself — intersect in a web of deterrence calculations, historical claims, and economic interdependencies that defy simple resolution.</p>
    <h2>Beijing's Timeline Pressures</h2>
    <p>Internal PLA assessments, partially revealed through open-source analysis of defence white papers and procurement patterns, suggest a capability window opening between 2027 and 2035 — a period during which China's military modernisation reaches maturity while demographic and economic pressures on CCP legitimacy intensify.</p>
    <h2>The Deterrence Paradox</h2>
    <p>American strategic ambiguity — the deliberate policy of neither confirming nor denying military commitment to Taiwan — is increasingly questioned by strategists who argue that ambiguity deters Taiwan's own risk-taking as effectively as it deters Beijing, creating a dangerous information vacuum during a crisis.</p>`,
    tags: ['China', 'Taiwan', 'USA', 'Geopolitics'],
    aiSummary: 'Taiwan contingency planning is constrained by a deterrence paradox in which American strategic ambiguity simultaneously restrains Beijing and limits Taipei\'s own defence preparations, creating compounded uncertainty during crisis scenarios.',
  },
  {
    title: 'Iran\'s Proxy Network: The Architecture of Asymmetric Power Projection',
    category: 'Geopolitics',
    content: `<p>Iran's ability to project power across the Middle East without deploying its own conventional forces represents one of the most sophisticated proxy warfare architectures in modern history. Understanding its structure is essential to understanding the region's security dynamics.</p>
    <h2>The "Axis of Resistance"</h2>
    <p>Iran's network — encompassing Hezbollah in Lebanon, Hamas and Palestinian Islamic Jihad in Gaza, the Houthis in Yemen, and various Shia militia groups in Iraq and Syria — is deliberately designed to be non-hierarchical, reducing Iranian culpability while maintaining strategic direction.</p>
    <h2>Weapons Transfer Corridors</h2>
    <p>The physical infrastructure of the network — weapons storage facilities, transfer corridors through Syria, maritime smuggling routes — has become a primary target for Israeli and occasionally American strikes, creating a persistent cat-and-mouse dynamic that shapes operational planning across the region.</p>`,
    tags: ['Iran', 'Middle East', 'Proxy', 'Geopolitics'],
    aiSummary: 'Iran\'s deliberately non-hierarchical proxy network provides strategic deniability while maintaining operational direction, making conventional deterrence and attribution extremely difficult for opposing powers to operationalise.',
  },
  {
    title: 'Space Domain Awareness: The New Frontier of Military Competition',
    category: 'Defence',
    content: `<p>Low Earth orbit has become a contested military domain with extraordinary speed. What was once the exclusive preserve of superpowers with decade-long development programmes can now be accessed by mid-tier states using commercial launch services and increasingly miniaturised satellite platforms.</p>
    <h2>Anti-Satellite Capabilities</h2>
    <p>At least five nations now possess demonstrated or assessed direct-ascent anti-satellite (ASAT) capabilities. More concerningly, co-orbital systems — satellites manoeuvred into proximity with adversary satellites — represent a deniable grey-zone threat that current international norms are ill-equipped to address.</p>
    <h2>Commercial Sector Integration</h2>
    <p>The integration of commercial satellite constellations into military operations — most visibly in communications and ISR — creates a profound legal ambiguity about the status of commercial space assets in armed conflict, with significant implications for escalation management.</p>`,
    tags: ['Space', 'ASAT', 'Defence', 'Technology'],
    aiSummary: 'Rapid commercialisation of space capabilities has lowered the barrier to entry for military space operations while creating significant legal ambiguity about commercial satellite status in conflict, complicating escalation management for all parties.',
  },
]

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log('✓ Connected to MongoDB')

    // Clear existing posts (optional — comment out to keep existing data)
    await Post.deleteMany({})
    console.log('✓ Cleared existing posts')

    // Insert sample posts
    const created = await Post.insertMany(SAMPLE_POSTS)
    console.log(`✓ Inserted ${created.length} sample posts`)

    console.log('\nSample posts created:')
    created.forEach(p => console.log(`  [${p.category}] ${p.title.slice(0, 60)}...`))

  } catch (err) {
    console.error('Seed failed:', err.message)
  } finally {
    await mongoose.disconnect()
    console.log('\n✓ Done. Run: npm run dev')
  }
}

seed()
