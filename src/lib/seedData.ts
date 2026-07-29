import type { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const CATEGORIES = [
  { key: "notes", label: "Notes", subtext: "Handwritten notes, class notes, revision notes.", iconKey: "notes" },
  { key: "books", label: "Books", subtext: "Textbooks, reference books, guides.", iconKey: "book" },
  { key: "lab", label: "Lab material", subtext: "Lab files, manuals, records.", iconKey: "lab" },
  { key: "tools", label: "Tools", subtext: "Calculators, drafters, lab coats.", iconKey: "tools" },
  { key: "stationery", label: "Stationery", subtext: "Notebooks, folders, registers.", iconKey: "stationery" },
];

const PEOPLE = [
  { key: "nandini", email: "nandini.rao@s.amity.edu", name: "Nandini Rao", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", displayMode: "FIRST_NAME" as const },
  { key: "ananya", email: "ananya.gupta@s.amity.edu", name: "Ananya Gupta", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", displayMode: "FIRST_NAME" as const },
  { key: "aarav", email: "aarav.mehta@s.amity.edu", name: "Aarav Mehta", school: "ASET", course: "B.Tech ECE", semester: "Sem 2", displayMode: "FIRST_NAME" as const },
  { key: "riya", email: "riya.sharma@s.amity.edu", name: "Riya Sharma", school: "ABS", course: "BBA", semester: "Sem 1", displayMode: "FIRST_NAME" as const },
  { key: "ishaan", email: "ishaan.kapoor@s.amity.edu", name: "Ishaan Kapoor", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", displayMode: "ANONYMOUS" as const },
  { key: "sana", email: "sana.khan@s.amity.edu", name: "Sana Khan", school: "ASET", course: "B.Tech IT", semester: "Sem 2", displayMode: "FIRST_NAME" as const },
  { key: "meera", email: "meera.nair@s.amity.edu", name: "Meera Nair", school: "ALS", course: "B.A. LLB", semester: "Sem 4", displayMode: "ANONYMOUS" as const },
  { key: "dev", email: "dev.singh@s.amity.edu", name: "Dev Singh", school: "AIPS", course: "B.Pharm", semester: "Sem 3", displayMode: "ANONYMOUS" as const },
  { key: "kabir", email: "kabir.verma@s.amity.edu", name: "Kabir Verma", school: "ASCO", course: "B.Com", semester: "Sem 2", displayMode: "FIRST_NAME" as const },
  { key: "priya", email: "priya.das@s.amity.edu", name: "Priya Das", school: "ASFA", course: "BFA", semester: "Sem 1", displayMode: "FIRST_NAME" as const },
  { key: "rohan", email: "rohan.joshi@s.amity.edu", name: "Rohan Joshi", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", displayMode: "FIRST_NAME" as const },
  { key: "tara", email: "tara.iyer@s.amity.edu", name: "Tara Iyer", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", displayMode: "FIRST_NAME" as const },
];

// One representative real photo per category (not per listing) -- pulled from
// Wikipedia's own lead image for each topic at seed time, since this runs on
// Vercel (real internet access) rather than the sandbox that authored it.
// Falls back to the drawn CategoryIllustration if the fetch fails.
const CATEGORY_WIKI_TITLES: Record<string, string> = {
  notes: "Note-taking",
  books: "Book",
  lab: "Laboratory_glassware",
  tools: "Calculator",
  stationery: "Stationery",
};

async function resolveCategoryImages(log: (msg: string) => void): Promise<Record<string, string>> {
  const result: Record<string, string> = {};
  await Promise.all(
    Object.entries(CATEGORY_WIKI_TITLES).map(async ([key, title]) => {
      try {
        const res = await fetch(
          `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=900&origin=*`,
          {
            signal: AbortSignal.timeout(8000),
            headers: {
              // Wikimedia's API rejects requests without a descriptive User-Agent.
              "User-Agent": "PassItOnApp/1.0 (https://pass-it-on-lilac.vercel.app; contact@passiton.app) node-fetch",
              Accept: "application/json",
            },
          }
        );
        if (!res.ok) {
          log(`Fetch for "${key}" (${title}) returned ${res.status} ${res.statusText}`);
          return;
        }
        const data = await res.json();
        const pages = data?.query?.pages as Record<string, { thumbnail?: { source?: string } }> | undefined;
        const page = pages ? Object.values(pages)[0] : undefined;
        const url = page?.thumbnail?.source;
        if (url) {
          result[key] = url;
          log(`Photo for "${key}": ${url}`);
        } else {
          log(`No thumbnail found for "${key}" (${title}). Raw: ${JSON.stringify(data).slice(0, 300)}`);
        }
      } catch (e) {
        log(`Could not fetch a photo for "${key}" (${title}): ${e}`);
      }
    })
  );
  return result;
}

export async function runSeed(prisma: PrismaClient, log: (msg: string) => void = console.log) {
  log("Seeding categories...");
  const catByKey: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const created = await prisma.category.upsert({ where: { key: c.key }, update: c, create: c });
    catByKey[c.key] = created.id;
  }

  log("Seeding people...");
  const passwordHash = await bcrypt.hash("passiton123", 10);
  const userByKey: Record<string, string> = {};
  for (const p of PEOPLE) {
    const user = await prisma.user.upsert({
      where: { email: p.email },
      update: {},
      create: {
        email: p.email,
        passwordHash,
        name: p.name,
        school: p.school,
        course: p.course,
        semester: p.semester,
        displayMode: p.displayMode,
        verified: true,
      },
    });
    userByKey[p.key] = user.id;
  }

  await prisma.subject.deleteMany({ where: { userId: userByKey.nandini } });
  await prisma.subject.createMany({
    data: [
      { userId: userByKey.nandini, name: "DBMS", code: "CS-301" },
      { userId: userByKey.nandini, name: "Maths III", code: "MA-301" },
      { userId: userByKey.nandini, name: "Operating Systems", code: "CS-303" },
    ],
  });

  log("Fetching one real photo per category from Wikipedia...");
  const categoryImages = await resolveCategoryImages(log);
  log(`Got photos for: ${Object.keys(categoryImages).join(", ") || "none"}`);

  log("Seeding listings...");
  await prisma.listing.deleteMany({});
  const listingsData = [
    { owner: "nandini", cat: "notes", title: "B.Tech CSE Sem 3 Notes - DBMS Complete", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", subjectCode: "CS-301", price: 120, condition: "GOOD", status: "AVAILABLE", description: "Complete handwritten notes covering all units for DBMS. Neat handwriting, useful for internals and end-sem.", usefulFor: ["Internals", "End-sem"], pickupSpot: "ASET Block 1 lobby", availability: "Weekday evenings", photos: 3 },
    { owner: "nandini", cat: "books", title: "Data Structures Textbook (Lipschutz)", school: "ASET", course: "B.Tech IT", semester: "Sem 3", subjectCode: "CS-303", price: 350, condition: "GOOD", status: "RESERVED", description: "Used for one semester, all pages intact, minor highlighting.", usefulFor: ["Assignments", "Revision"], pickupSpot: "ASET Cafeteria", availability: "Anytime after 4pm", photos: 2 },
    { owner: "nandini", cat: "lab", title: "DSA Lab File - Sem 3", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", subjectCode: "CS-305", price: 150, condition: "GOOD", status: "PASSED", description: "All 10 programs with verified outputs, viva-ready.", usefulFor: ["Lab work"], pickupSpot: "ASET Block 2", availability: "Mornings", photos: 2 },
    { owner: "nandini", cat: "tools", title: "Drafter + Scale Set", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", subjectCode: "", price: 200, condition: "LIKE_NEW", status: "AVAILABLE", description: "Barely used, bought for EG class.", usefulFor: ["Lab work"], pickupSpot: "ASET Main Gate", availability: "Weekends", photos: 1 },
    { owner: "aarav", cat: "lab", title: "Chemistry Lab Manual", school: "ASET", course: "B.Tech ECE", semester: "Sem 2", subjectCode: "CH-201", price: 90, condition: "GOOD", status: "AVAILABLE", description: "Handwritten manual with all experiments and observations filled.", usefulFor: ["Lab work", "PYQs"], pickupSpot: "ASET Block 3", availability: "After 5pm", photos: 2 },
    { owner: "riya", cat: "stationery", title: "Spiral Notebook Pack (5)", school: "ABS", course: "BBA", semester: "Sem 1", subjectCode: "", price: 150, condition: "LIKE_NEW", status: "AVAILABLE", description: "Unused pack of 5 spiral notebooks, 200 pages each.", usefulFor: ["Revision"], pickupSpot: "ABS Reception", availability: "Anytime", photos: 1 },
    { owner: "ishaan", cat: "tools", title: "Scientific Calculator (fx-991)", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", subjectCode: "", price: 450, condition: "LIKE_NEW", status: "AVAILABLE", description: "Barely used fx-991ES Plus, all functions working.", usefulFor: ["Internals", "End-sem"], pickupSpot: "ASET Library", availability: "Weekday afternoons", photos: 2 },
    { owner: "sana", cat: "notes", title: "Engineering Graphics Notes", school: "ASET", course: "B.Tech IT", semester: "Sem 2", subjectCode: "EG-201", price: 0, condition: "GOOD", status: "AVAILABLE", description: "Complete notes with diagrams, free giveaway.", usefulFor: ["Revision", "End-sem"], pickupSpot: "ASET Block 1", availability: "Evenings", photos: 2 },
    { owner: "meera", cat: "books", title: "Business Law Textbook", school: "ALS", course: "B.A. LLB", semester: "Sem 4", subjectCode: "LLB-401", price: 300, condition: "OKAY", status: "AVAILABLE", description: "Some highlighting, all pages present.", usefulFor: ["Assignments"], pickupSpot: "ALS Block 2", availability: "Weekends", photos: 1 },
    { owner: "rohan", cat: "notes", title: "Maths III Handwritten Notes + PYQs", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", subjectCode: "MA-301", price: 100, condition: "GOOD", status: "AVAILABLE", description: "Includes last 3 years PYQs solved.", usefulFor: ["PYQs", "End-sem"], pickupSpot: "ASET Cafeteria", availability: "Anytime", photos: 3 },
    { owner: "dev", cat: "lab", title: "Pharmacology Lab Record", school: "AIPS", course: "B.Pharm", semester: "Sem 3", subjectCode: "PH-301", price: 70, condition: "OKAY", status: "AVAILABLE", description: "Filled record with viva questions noted.", usefulFor: ["Lab work"], pickupSpot: "AIPS Block 1", availability: "Mornings", photos: 1 },
    { owner: "priya", cat: "stationery", title: "Sketching Kit (Full Set)", school: "ASFA", course: "BFA", semester: "Sem 1", subjectCode: "", price: 250, condition: "WORN", status: "AVAILABLE", description: "Used for one semester, clean.", usefulFor: ["Lab work"], pickupSpot: "ASFA Studio 2", availability: "Weekdays", photos: 1 },
    { owner: "tara", cat: "tools", title: "Drafting Kit (Full Set)", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", subjectCode: "", price: 180, condition: "GOOD", status: "RESERVED", description: "Complete drafting kit with compass box.", usefulFor: ["Lab work"], pickupSpot: "ASET Block 1", availability: "Evenings", photos: 2 },
    { owner: "kabir", cat: "books", title: "Financial Accounting Textbook", school: "ASCO", course: "B.Com", semester: "Sem 2", subjectCode: "BC-201", price: 0, condition: "GOOD", status: "PASSED", description: "Given away already, kept here for reference.", usefulFor: ["Revision"], pickupSpot: "ASCO Block 1", availability: "—", photos: 1 },
  ] as const;

  const listingIds: Record<string, string> = {};
  for (const l of listingsData) {
    const created = await prisma.listing.create({
      data: {
        ownerId: userByKey[l.owner],
        categoryId: catByKey[l.cat],
        title: l.title,
        description: l.description,
        school: l.school,
        course: l.course,
        semester: l.semester,
        subjectCode: l.subjectCode || null,
        condition: l.condition,
        usefulFor: [...l.usefulFor],
        priceType: l.price === 0 ? "FREE" : "PAID",
        price: l.price,
        pickupSpot: l.pickupSpot,
        availability: l.availability,
        status: l.status,
        photos: categoryImages[l.cat] ? { create: [{ url: categoryImages[l.cat], position: 0 }] } : undefined,
      },
    });
    listingIds[l.title] = created.id;
  }

  log("Seeding requests...");
  await prisma.request.deleteMany({});
  const requestsData = [
    { by: "rohan", cat: "notes", title: "Looking for DBMS Unit 3 handwritten notes", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", subjectCode: "CS-302", needBy: "Friday", note: "Need before internal exam, will collect from campus." },
    { by: "tara", cat: "notes", title: "Need Maths III previous year question papers", school: "ASET", course: "B.Tech CSE", semester: "Sem 3", subjectCode: "MA-301", needBy: "this weekend", note: "Any last 3 years PYQs would help." },
    { by: "meera", cat: "books", title: "Searching for Business Law textbook (used)", school: "ALS", course: "B.A. LLB", semester: "Sem 4", subjectCode: "LLB-401", needBy: "next week", note: "Any edition works, just need it readable." },
    { by: "dev", cat: "lab", title: "Need Pharmacology lab manual (filled)", school: "AIPS", course: "B.Pharm", semester: "Sem 3", subjectCode: "PH-301", needBy: "Wednesday", note: "Lost mine, need reference before submission." },
    { by: "ishaan", cat: "tools", title: "Looking for a spare scientific calculator", school: "ASET", course: "B.Tech CSE", semester: "Sem 1", subjectCode: "", needBy: "tomorrow", note: "Just for exam day, can return after." },
    { by: "riya", cat: "stationery", title: "Need 2 spiral notebooks urgently", school: "ABS", course: "BBA", semester: "Sem 1", subjectCode: "", needBy: "today", note: "Ran out before class, any color works." },
  ] as const;
  const requestIds: Record<string, string> = {};
  for (const r of requestsData) {
    const created = await prisma.request.create({
      data: {
        requesterId: userByKey[r.by],
        categoryId: catByKey[r.cat],
        title: r.title,
        school: r.school,
        course: r.course,
        semester: r.semester,
        subjectCode: r.subjectCode || null,
        needBy: r.needBy,
        note: r.note,
      },
    });
    requestIds[r.title] = created.id;
  }

  log("Seeding threads + messages...");
  await prisma.message.deleteMany({});
  await prisma.thread.deleteMany({});

  async function makeThread(
    aKey: string,
    bKey: string,
    ref: { type: "LISTING"; id: string } | { type: "REQUEST"; id: string },
    messages: { from: string; text: string }[]
  ) {
    const [userAId, userBId] = [userByKey[aKey], userByKey[bKey]].sort();
    const thread = await prisma.thread.create({
      data: {
        refType: ref.type,
        listingId: ref.type === "LISTING" ? ref.id : undefined,
        requestId: ref.type === "REQUEST" ? ref.id : undefined,
        userAId,
        userBId,
      },
    });
    for (const m of messages) {
      await prisma.message.create({ data: { threadId: thread.id, senderId: userByKey[m.from], text: m.text } });
    }
  }

  await makeThread("nandini", "aarav", { type: "LISTING", id: listingIds["Chemistry Lab Manual"] }, [
    { from: "aarav", text: "Hi! Is the Chemistry Lab Manual still available?" },
    { from: "nandini", text: "Yes, still have it!" },
  ]);
  await makeThread("nandini", "rohan", { type: "REQUEST", id: requestIds["Looking for DBMS Unit 3 handwritten notes"] }, [
    { from: "rohan", text: "Hey, do you have DBMS Unit 3 notes?" },
  ]);
  await makeThread("nandini", "meera", { type: "LISTING", id: listingIds["Business Law Textbook"] }, [
    { from: "nandini", text: "Is the Business Law textbook price negotiable?" },
    { from: "meera", text: "A little, can do ₹270." },
  ]);

  log("Seeding saved + notifications...");
  await prisma.savedListing.deleteMany({});
  await prisma.savedListing.createMany({
    data: [
      { userId: userByKey.nandini, listingId: listingIds["Scientific Calculator (fx-991)"] },
      { userId: userByKey.nandini, listingId: listingIds["Maths III Handwritten Notes + PYQs"] },
    ],
  });

  await prisma.notification.deleteMany({});
  await prisma.notification.createMany({
    data: [
      { userId: userByKey.nandini, type: "MESSAGE", text: "Aarav sent you a message about Chemistry Lab Manual.", read: false },
      { userId: userByKey.nandini, type: "REQUEST", text: "Rohan responded to your request.", read: false },
      { userId: userByKey.nandini, type: "SYSTEM", text: "Welcome to Pass It On! Add your subjects for better recommendations.", read: true },
    ],
  });

  log("Done. Demo login: nandini.rao@s.amity.edu / passiton123");
}
