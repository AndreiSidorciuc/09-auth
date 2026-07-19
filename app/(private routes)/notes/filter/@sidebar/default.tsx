import css from "./SidebarNotes.module.css";

const tags = ["Todo", "Work", "Personal", "Meeting", "Shopping"];

export default function SidebarNotes() {
  return (
    <ul className={css.menuList}>
      <li className={css.menuItem}>
        {/* eslint-disable-next-line @next/next/no-html-link-for-pages -- assignment spec requires a plain <a> here */}
        <a href="/notes/filter/all" className={css.menuLink}>
          All notes
        </a>
      </li>

      {tags.map((tag) => (
        <li key={tag} className={css.menuItem}>
          <a href={`/notes/filter/${tag}`} className={css.menuLink}>
            {tag}
          </a>
        </li>
      ))}
    </ul>
  );
}
