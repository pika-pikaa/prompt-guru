# Perplexity Pro - Najlepsze Praktyki

Źródło: [Perplexity Prompt Guide](https://docs.perplexity.ai/guides/prompt-guide), [Perplexity Help Center](https://www.perplexity.ai/hub/faq/prompting-tips-and-examples-on-perplexity)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Myśl jak wyszukiwarka** - używaj terminów, które eksperci użyliby w artykułach
2. **Bądź konkretny** - dodaj 2-3 słowa kontekstu, określ zakres czasowy i źródła
3. **Deep Research = precyzyjne pytanie** - im lepiej zdefiniujesz cel, tym lepszy raport

### UNIKAJ:
- **Few-shot examples** - mylą wyszukiwarkę (szuka przykładów zamiast odpowiedzi)
- **Role-playing** - "Jesteś ekspertem..." nie działa z wyszukiwarką
- **Prośby o URL** - model halucynuje linki, używaj wyników z API
- **Zbyt szerokich pytań** - "opowiedz o AI" → rozproszone wyniki

### SZYBKI START:
```
[Konkretne pytanie] + [kontekst czasowy] + [typ źródeł] + [format odpowiedzi]

Przykład: "Porównaj najnowsze frameworki JavaScript (2024-2025)
pod kątem wydajności. Skup się na benchmarkach z oficjalnych źródeł.
Format: tabela porównawcza + rekomendacja."
```

---

## O Perplexity Pro

### Tryby wyszukiwania:

| Tryb | Opis | Kiedy używać |
|------|------|--------------|
| **Quick Search** | Szybkie odpowiedzi | Proste pytania faktograficzne |
| **Pro Search** | Pogłębione wyszukiwanie | Złożone pytania wymagające wielu źródeł |
| **Deep Research** | Wieloetapowa analiza (do 4 min) | Raporty, meta-analizy, badania |

### Focus Modes:

| Tryb | Źródła |
|------|--------|
| **All** | Cały internet |
| **Academic** | Publikacje naukowe, peer-reviewed |
| **YouTube** | Transkrypty i opisy wideo |
| **Reddit** | Dyskusje i opinie społeczności |
| **Wolfram** | Obliczenia, matematyka, dane |
| **Writing** | Tryb bez wyszukiwania (jak ChatGPT) |

---

## Kluczowe różnice od tradycyjnych LLM

### Perplexity ≠ ChatGPT

| Aspekt | Tradycyjny LLM | Perplexity |
|--------|----------------|------------|
| Źródło wiedzy | Trening | Real-time web search |
| Role-playing | Działa | **Nie działa** |
| Few-shot | Poprawia jakość | **Psuje wyniki** |
| Aktualność | Do daty treningu | Na bieżąco |
| Cytaty | Halucynuje | Prawdziwe źródła |

### Co to oznacza dla promptów:

```
❌ ŹLE (styl ChatGPT):
"Jesteś ekspertem od marketingu. Przeanalizuj trendy w social media.
Oto przykład analizy: [przykład]. Teraz zrób podobną dla TikTok."

✅ DOBRZE (styl Perplexity):
"Trendy w marketingu na TikTok 2024-2025:
statystyki zaangażowania, zmiany algorytmu, case studies marek.
Źródła: raporty branżowe i oficjalne dane TikTok."
```

---

## Zasady tworzenia promptów

### 1. Myśl jak użytkownik wyszukiwarki

Używaj terminów, które eksperci użyliby w artykułach online.

**Źle:**
```
Co powinienem wiedzieć o inwestowaniu?
```

**Dobrze:**
```
Strategie inwestycyjne dla początkujących 2025:
ETF vs akcje dywidendowe, porównanie ryzyka i zwrotów.
```

### 2. Dodawaj krytyczny kontekst

2-3 słowa kontekstu znacząco poprawiają wyniki.

**Źle:**
```
Wyjaśnij przepisy o aplikacjach
```

**Dobrze:**
```
Wpływ regulacji EU Digital Markets Act 2023
na konkurencję w sklepach z aplikacjami dla małych deweloperów
```

### 3. Określaj zakres czasowy

Perplexity szuka aktualnych informacji - pomóż mu.

```
Zmiany w algorytmie Google SEO Q4 2024 - Q1 2025
Najnowsze badania nad mRNA po 2024 roku
Porównanie cen GPU: grudzień 2024 vs styczeń 2025
```

### 4. Wskazuj typ źródeł

```
"...cytuj tylko oficjalne strony i peer-reviewed journals"
"...na podstawie raportów branżowych (Gartner, McKinsey)"
"...z oficjalnej dokumentacji i GitHub issues"
```

### 5. Określaj format odpowiedzi

```
"Format: tabela porównawcza z 5 kryteriami"
"Podsumuj w 5 punktach + źródła"
"Executive summary (3 zdania) + szczegóły"
```

---

## Deep Research - Tryb Badawczy

### Kiedy używać Deep Research:

- Raporty wymagające wielu źródeł
- Meta-analizy i porównania
- Tematy wymagające weryfikacji krzyżowej
- Złożone pytania badawcze

### Jak formułować zapytania Deep Research:

```
Deep Research: [Precyzyjne pytanie badawcze]
+ [Zakres czasowy]
+ [Typ źródeł]
+ [Oczekiwany format raportu]
```

### Przykłady dobrych zapytań Deep Research:

```
Deep Research: Meta-analiza skuteczności szczepionek mRNA
w badaniach klinicznych po 2024 roku.
Porównaj wyniki z różnych krajów.
Źródła: peer-reviewed journals i oficjalne dane WHO.
```

```
Deep Research: Porównanie frameworków AI do generowania kodu
(GitHub Copilot, Cursor, Codeium) - grudzień 2024.
Kryteria: dokładność, szybkość, cena, integracje.
Format: tabela + rekomendacja dla zespołu 10 developerów.
```

```
Deep Research: Zmiany w polityce prywatności Big Tech 2023-2025.
Porównaj Apple, Google, Meta.
Cytuj tylko oficjalne polityki i komunikaty prasowe.
```

### Czego unikać w Deep Research:

```
❌ Zbyt szerokie:
"Opowiedz o sztucznej inteligencji"

❌ Bez kontekstu czasowego:
"Jakie są najlepsze praktyki SEO?"

❌ Bez określonych źródeł:
"Znajdź informacje o blockchain"
```

---

## Pro Search vs Deep Research

| Aspekt | Pro Search | Deep Research |
|--------|------------|---------------|
| Czas | Sekundy | Do 4 minut |
| Głębokość | Kilka źródeł | Dziesiątki źródeł |
| Iteracje | Jedna runda | Wielokrotne crawlowanie |
| Użycie | Szybkie odpowiedzi | Raporty, analizy |
| Limit (Pro) | Bez limitu | ~5/dzień |

### Kiedy który tryb:

```
Pro Search:
→ "Jaka jest aktualna cena Bitcoin?"
→ "Kiedy premiera iPhone 17?"
→ "Najnowsze zmiany w React 19"

Deep Research:
→ "Analiza konkurencji na rynku EV w Europie 2025"
→ "Porównanie polityk klimatycznych G20"
→ "Stan badań nad fuzją jądrową - przegląd 2024"
```

---

## Threads - Budowanie kontekstu

Perplexity zapamiętuje kontekst w wątkach (Threads).

### Strategia iteracyjna:

```
Zapytanie 1: "Najważniejsze zmiany w prawie pracy PL 2024"
↓
Zapytanie 2: "Rozwiń punkt o pracy zdalnej"
↓
Zapytanie 3: "Jakie są kary za nieprzestrzeganie?"
↓
Zapytanie 4: "Podsumuj wszystko w formie checklisty dla HR"
```

### Wskazówki:

- Używaj follow-up questions zamiast nowych wątków
- Odwołuj się do poprzednich odpowiedzi
- Na końcu proś o podsumowanie całego wątku

---

## Zapobieganie halucynacjom

### Jawne instrukcje:

```
"Jeśli nie znajdziesz wiarygodnych źródeł, powiedz wprost."

"Odpowiadaj TYLKO na podstawie znalezionych źródeł.
Nie zgaduj ani nie uzupełniaj z wiedzy ogólnej."

"Dla każdej informacji podaj źródło.
Jeśli źródło jest niepewne - zaznacz to."
```

### NIGDY nie proś o URL w promptcie:

```
❌ "Podaj linki do artykułów"
→ Model wymyśli fałszywe URL-e

✅ "Wymień tytuły artykułów i autorów"
→ Linki są w wynikach wyszukiwania automatycznie
```

---

## API - Parametry zamiast promptów

Dla deweloperów - używaj parametrów API, nie promptów:

| Parametr | Funkcja |
|----------|---------|
| `search_domain_filter` | Ogranicz do zaufanych domen |
| `search_recency_filter` | Filtruj po dacie (day/week/month/year) |
| `web_search_options.search_context_size` | low/medium/high |

```
✅ API: search_domain_filter: ["nature.com", "science.org"]
❌ Prompt: "szukaj tylko na nature.com i science.org"
```

---

## Przykłady promptów według zastosowania

### Badania rynkowe:
```
Deep Research: Analiza rynku [branża] w Polsce 2024-2025.
Wielkość rynku, główni gracze, trendy wzrostu.
Źródła: raporty PMR, GUS, branżowe.
Format: executive summary + szczegóły + prognozy.
```

### Analiza konkurencji:
```
Porównaj [firma A] vs [firma B] vs [firma C]:
- Oferta produktowa (stan na styczeń 2025)
- Cennik
- Opinie użytkowników (Trustpilot, G2)
- Ostatnie ogłoszenia i aktualizacje
Tabela porównawcza + rekomendacja.
```

### Research techniczny:
```
[Technologia/framework]: aktualna dokumentacja i best practices.
Skup się na: [aspekt 1], [aspekt 2].
Źródła: oficjalna dokumentacja, GitHub, Stack Overflow 2024+.
```

### Fact-checking:
```
Zweryfikuj twierdzenie: "[twierdzenie]"
Znajdź źródła potwierdzające i zaprzeczające.
Oceń wiarygodność na podstawie jakości źródeł.
```

### Przegląd literatury:
```
Academic Focus: Przegląd badań nad [temat] 2022-2025.
Główne odkrycia, metodologie, luki badawcze.
Tylko peer-reviewed journals.
Format: synteza + lista 10 kluczowych publikacji.
```

---

## Checklist przed wysłaniem promptu

- [ ] Pytanie jest konkretne (nie ogólne)
- [ ] Określony zakres czasowy (jeśli ważny)
- [ ] Wskazany typ/jakość źródeł
- [ ] Określony format odpowiedzi
- [ ] Brak role-playing ("Jesteś ekspertem...")
- [ ] Brak few-shot examples
- [ ] Brak prośby o URL (linki są automatyczne)
- [ ] Wybrany odpowiedni tryb (Quick/Pro/Deep Research)
- [ ] Wybrany odpowiedni Focus Mode (jeśli potrzebny)
