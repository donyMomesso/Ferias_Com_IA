"use client";

export function CategoryFilter({
  categories,
  selected,
  onSelect
}: {
  categories: string[];
  selected?: string;
  onSelect: (category: string) => void;
}) {
  return (
    <div className="category-filter">
      {categories.map((category) => (
        <button
          key={category}
          className={selected === category ? "active" : ""}
          onClick={() => onSelect(category)}
        >
          {category}
        </button>
      ))}
    </div>
  );
}
