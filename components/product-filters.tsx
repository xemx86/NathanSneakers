import { Locale } from "@/lib/i18n";
import { getDictionary } from "@/lib/get-dictionary";

/* Typ propsów dla komponentu filtrów produktów */
type Props = {
  /* Aktualny język strony */
  lang: Locale;

  /* Lista kategorii do selecta */
  categories: string[];

  /* Lista kolorów do selecta */
  colors: string[];

  /* Lista materiałów do selecta */
  materials: string[];

  /* Aktualnie ustawione filtry */
  current: {
    q: string;
    category: string;
    color: string;
    material: string;
    audience: string;
    sort: string;
  };
};

export async function ProductFilters({
  lang,
  categories,
  colors,
  materials,
  current,
}: Props) {
  /* Pobranie słownika tłumaczeń */
  const dict = await getDictionary(lang);

  return (
    <aside className="filters panel">
      {/* Tytuł panelu filtrów */}
      <h3>{dict.filters.title}</h3>

      {/* Formularz filtrów */}
      <form className="filters__group" action={`/${lang}/sklep`}>
        {/* Wyszukiwanie tekstowe */}
        <label>
          {dict.filters.search}
          <input
            name="q"
            defaultValue={current.q}
            placeholder={dict.filters.searchPlaceholder}
          />
        </label>

        {/* Filtr kategorii */}
        <label>
          {dict.filters.category}
          <select name="category" defaultValue={current.category}>
            <option value="">{dict.filters.all}</option>
            {categories.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        {/* Filtr koloru */}
        <label>
          {dict.filters.color}
          <select name="color" defaultValue={current.color}>
            <option value="">{dict.filters.all}</option>
            {colors.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </select>
        </label>

        {/* Filtr materiału */}
<label>
  {lang === "es" ? "Materiales" : "Material"}
  <select name="material" defaultValue={current.material}>
    <option value="">{dict.filters.all}</option>
    {materials.map((value) => (
      <option key={value} value={value}>
        {value}
      </option>
    ))}
  </select>
</label>

        {/* Filtr odbiorcy produktu */}
  <label>
    
  {lang === "es" ? "Género" : "Audience"}
<select name="audience" defaultValue={current.audience}>
  <option value="">
    {dict.filters.all}
  </option>

  <option value="men">
    {lang === "es" ? "Hombre" : "Men"}
  </option>

  <option value="women">
    {lang === "es" ? "Mujer" : "Women"}
  </option>

  <option value="kids">
    {lang === "es" ? "Niños" : "Kids"}
  </option>

  <option value="unisex">
    {lang === "es" ? "Unisex" : "Unisex"}
  </option>
</select>
        </label>

        {/* Sortowanie */}
        <label>
          {dict.filters.sort}
          <select name="sort" defaultValue={current.sort}>
            <option value="newest">{dict.filters.newest}</option>
            <option value="price_asc">{dict.filters.priceAsc}</option>
            <option value="price_desc">{dict.filters.priceDesc}</option>
            <option value="name_asc">{dict.filters.nameAsc}</option>
          </select>
        </label>

        {/* Przyciski akcji */}
        <div className="inline-actions">
          <button className="button" type="submit">
            {dict.filters.apply}
          </button>

          <a className="button-secondary" href={`/${lang}/sklep`}>
            {dict.filters.clear}
          </a>
        </div>
      </form>
    </aside>
  );
}