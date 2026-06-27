import {
  createStatisticsSection,
  getStatisticsSection,
  createStatisticsItem,
} from "./src/actions/statistics-section-actions";

async function verify() {
  console.log("Verifying Statistics Section...");

  // 1. Create Section
  console.log("Creating section...");
  const section = await createStatisticsSection({
    arabic_header: "Test Header AR",
    english_header: "Test Header EN",
    arabic_description: "Test Desc AR",
    english_description: "Test Desc EN",
  });

  if (!section.success || !section.data) {
    console.error("Failed to create section");
    return;
  }
  console.log("Section created:", section.data.id);

  // 2. Add Item
  console.log("Adding item...");
  const item = await createStatisticsItem(section.data.id, {
    arabic_title: "Item AR",
    english_title: "Item EN",
    percentage: 50,
    color: "#ff0000",
  });

  if (!item.success || !item.data) {
    console.error("Failed to add item");
    return;
  }
  console.log("Item added:", item.data.id);

  // 3. Fetch
  console.log("Fetching section...");
  const fetched = await getStatisticsSection();

  if (!fetched.success || !fetched.data) {
    console.error("Failed to fetch");
    return;
  }

  if (fetched.data.items.length > 0) {
    console.log("Verification SUCCESS: Section and items exist.");
  } else {
    console.error("Verification FAILED: No items found.");
  }
}

verify();
