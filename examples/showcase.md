# Przykłady Optymalizacji Promptów

Prezentacja przed/po dla różnych modeli i typów zadań.

---

## Przykład 1: Code Review

### Cel użytkownika:
"Chcę żeby AI przejrzało mój kod"

### PRZED (słaby prompt):
```
Przejrzyj ten kod:

function calc(a,b) {
  return a+b
}
```

### PO optymalizacji:

#### Claude 4.5 Opus (Rozbudowany):
```xml
<context>
Projekt: Kalkulator finansowy
Język: JavaScript
Standard: ES6+
</context>

<task>
Przeprowadź code review poniższej funkcji.
</task>

<code>
function calc(a,b) {
  return a+b
}
</code>

<review_criteria>
- Poprawność typów i edge cases
- Nazewnictwo i czytelność
- Potencjalne błędy
- Zgodność z best practices
</review_criteria>

<output_format>
Lista problemów z priorytetami i konkretnymi sugestiami poprawy.
Pokaż kod przed i po dla każdej sugestii.
</output_format>
```

#### GPT-5.2 (Standardowy):
```
Przejrzyj tę funkcję JavaScript pod kątem:
1. Edge cases i walidacji
2. Nazewnictwa
3. Typowania

Kod:
```javascript
function calc(a,b) {
  return a+b
}
```

Format: Lista problemów z priorytetami + przykłady poprawionego kodu.
```

#### Grok 4.1 (Minimalny):
```
Code review tej funkcji JS - główne problemy:

function calc(a,b) { return a+b }
```

---

## Przykład 2: Napisanie funkcji

### Cel użytkownika:
"Potrzebuję funkcji do walidacji emaila"

### PRZED (słaby prompt):
```
Napisz funkcję walidacji email
```

### PO optymalizacji:

#### Claude 4.5 Sonnet (Rozbudowany):
```xml
<task>
Napisz funkcję walidującą adresy email.
</task>

<requirements>
- Język: TypeScript
- Zwraca: { valid: boolean, error?: string }
- Waliduje: format, długość, niedozwolone znaki
- Obsługuje: wielkie litery, subdomeny, + aliasy
</requirements>

<constraints>
Nie używaj zewnętrznych bibliotek.
Regex musi być czytelny (skomentowany).
</constraints>

<examples>
Valid: "user@example.com", "user+tag@sub.domain.com"
Invalid: "user@", "@domain.com", "user space@domain.com"
</examples>
```

#### Gemini 3 Pro (Standardowy):
```
Napisz funkcję TypeScript walidującą email.
Zwraca { valid: boolean, error?: string }.
Obsłuż aliasy (+tag) i subdomeny.
Bez zewnętrznych zależności.
```

#### Grok 4.1 (Minimalny):
```
Funkcja TS walidująca email - zwraca { valid, error? }
```

---

## Przykład 3: System Prompt dla Chatbota

### Cel użytkownika:
"Chatbot do obsługi klienta sklepu internetowego"

### PRZED (słaby prompt):
```
Bądź pomocny dla klientów
```

### PO optymalizacji:

#### Claude 4.5 (Rozbudowany):
```xml
<role>
Jesteś asystentem obsługi klienta sklepu TechShop.pl.
</role>

<personality>
- Przyjazny i profesjonalny
- Cierpliwy nawet przy trudnych pytaniach
- Proaktywny w oferowaniu pomocy
</personality>

<capabilities>
- Informacje o produktach i dostępności
- Status zamówień (pytaj o numer)
- Procedury zwrotów i reklamacji
- Podstawowe pytania techniczne
</capabilities>

<limitations>
- Nie masz dostępu do płatności - kieruj do formularza
- Nie możesz anulować zamówień - kieruj na infolinię
- Przy złożonych reklamacjach - zbierz dane i przekaż do człowieka
</limitations>

<communication_style>
Krótkie odpowiedzi. Używaj list kroków dla procedur.
Potwierdzaj zrozumienie problemu przed odpowiedzią.
</communication_style>

<example_interaction>
User: Gdzie jest moje zamówienie?
Assistant: Chętnie sprawdzę status Twojego zamówienia! Podaj proszę numer zamówienia (znajdziesz go w emailu potwierdzającym, zaczyna się od TS-).
</example_interaction>
```

#### GPT-5.2 (Standardowy):
```
Jesteś asystentem obsługi klienta TechShop.pl.

Możesz: informować o produktach, sprawdzać zamówienia (pytaj o numer), wyjaśniać zwroty/reklamacje.

Nie możesz: przetwarzać płatności, anulować zamówień. Kieruj do odpowiednich kanałów.

Styl: przyjazny, zwięzły, proaktywny. Potwierdzaj zrozumienie przed odpowiedzią.
```

#### Gemini 3 (Minimalny):
```
Asystent obsługi TechShop.pl. Informujesz o produktach i zamówieniach.
Nie przetwarzasz płatności - kieruj na infolinię.
Styl: przyjazny, krótkie odpowiedzi.
```

---

## Przykład 4: Analiza danych

### Cel użytkownika:
"Przeanalizuj te dane sprzedażowe"

### PRZED (słaby prompt):
```
Przeanalizuj dane:
[dane]
```

### PO optymalizacji:

#### Claude 4.5 Opus (Rozbudowany):
```xml
<context>
Dane sprzedażowe Q4 2024 dla działu elektroniki.
Cel: Przygotowanie raportu dla zarządu.
</context>

<data>
[dane CSV/tabela]
</data>

<analysis_tasks>
1. Identyfikacja trendów sprzedaży (wzrost/spadek vs Q3)
2. Top 5 produktów i bottom 5
3. Sezonowość (czy grudzień odbiegał)
4. Anomalie wymagające wyjaśnienia
</analysis_tasks>

<output_format>
## Executive Summary
[3 zdania - kluczowe wnioski]

## Trendy
[wizualizacja słowna + liczby]

## Rekomendacje
[konkretne działania z priorytetami]
</output_format>
```

#### GPT-5.2 (Standardowy):
```
Przeanalizuj dane sprzedażowe Q4 2024:

[dane]

Raport powinien zawierać:
1. Trendy vs poprzedni kwartał
2. Top/bottom produkty
3. Anomalie
4. Rekomendacje

Format: Executive summary + szczegóły + rekomendacje z priorytetami.
```

#### Gemini 3 (Minimalny):
```
[dane]

Kluczowe trendy, anomalie i 3 rekomendacje dla zarządu.
```

---

## Przykład 5: Generowanie obrazu (Nano Banana)

### Cel użytkownika:
"Zdjęcie produktowe słuchawek"

### PRZED (słaby prompt):
```
Słuchawki
```

### PO optymalizacji:

#### Rozbudowany:
```
Nowoczesne słuchawki bezprzewodowe w kolorze czarnym matowym,
unoszące się lekko nad minimalistycznym białym podłożem.
Profesjonalne oświetlenie studyjne z delikatnym blaskiem
podkreślającym eleganckie linie produktu.
Tło gradientowe od jasnoszarego do białego.
Lekki cień pod słuchawkami dodający głębi.
Styl: premium tech product photography.
```

#### Standardowy:
```
Czarne słuchawki bezprzewodowe na białym tle.
Oświetlenie studyjne. Minimalistyczny styl.
Premium product photo.
```

#### Minimalny:
```
Eleganckie czarne słuchawki bezprzewodowe,
białe tło, profesjonalne oświetlenie studyjne.
```

---

## Przykład 6: Tłumaczenie techniczne

### Cel użytkownika:
"Przetłumacz dokumentację API"

### PRZED (słaby prompt):
```
Przetłumacz na polski:
[tekst angielski]
```

### PO optymalizacji:

#### Claude 4.5 (Rozbudowany):
```xml
<task>
Przetłumacz dokumentację API z angielskiego na polski.
</task>

<source_text>
[tekst]
</source_text>

<translation_guidelines>
- Terminy techniczne: zachowaj oryginalne (endpoint, request, response)
- Komendy/kod: nie tłumacz
- Ton: profesjonalny, techniczny
- Czytelnik: developer ze znajomością angielskiego technicznego
</translation_guidelines>

<preserve>
- Formatowanie markdown
- Przykłady kodu
- Linki
</preserve>
```

#### GPT-5.2 (Standardowy):
```
Przetłumacz na polski (dokumentacja techniczna):

[tekst]

Zachowaj: terminy techniczne po angielsku (endpoint, request),
formatowanie markdown, przykłady kodu bez zmian.
Ton: profesjonalny, dla developerów.
```

#### Gemini 3 (Minimalny):
```
Na polski, zachowaj terminy techniczne i formatowanie:

[tekst]
```

---

---

## Przykład 7: Optymalizacja istniejącego promptu (Claude)

### Oryginalny prompt użytkownika:
```
Napisz mi artykuł o AI. Powinien być dobry i interesujący.
Think about what readers want to know. Make it engaging.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Brak konkretnego tematu | "AI" to zbyt szerokie pojęcie |
| Niejasne kryteria | "dobry i interesujący" nie mówi nic konkretnego |
| Słowo "think" | Claude 4.5 może reagować nieoptymalnie bez extended thinking |
| Brak formatu | Nie wiadomo jaka długość, struktura, dla kogo |
| Mieszane języki | Polski + angielski może powodować niespójność |

### Zoptymalizowany prompt:

```xml
<context>
Blog technologiczny dla przedsiębiorców.
Czytelnik: CEO/CTO bez głębokiej wiedzy technicznej.
</context>

<task>
Napisz artykuł o praktycznych zastosowaniach AI w małych i średnich firmach.
</task>

<requirements>
- Długość: 800-1000 słów
- 3-4 konkretne przykłady zastosowań z branż: e-commerce, usługi, produkcja
- Każdy przykład z szacunkowym ROI lub oszczędnością czasu
- Ton: przystępny, bez żargonu technicznego
</requirements>

<structure>
1. Hook - zaskakująca statystyka o adopcji AI w MŚP
2. Problem - dlaczego firmy boją się AI
3. Rozwiązania - 3-4 przykłady z rezultatami
4. CTA - pierwszy krok do wdrożenia
</structure>

<output_format>
Artykuł w markdown z nagłówkami H2 i H3.
Wyróżnij kluczowe liczby pogrubieniem.
</output_format>
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto "think" | Zamienione na konkretną strukturę |
| Dodano kontekst odbiorcy | Jasne dla kogo piszemy |
| Sprecyzowano temat | "AI w MŚP" zamiast "AI" |
| Dodano mierzalne kryteria | Długość, liczba przykładów, struktura |
| Ujednolicono język | Całość po polsku |
| Dodano format outputu | Markdown z konkretnymi wytycznymi |

---

## Przykład 8: Optymalizacja istniejącego promptu (GPT-5.2)

### Oryginalny prompt użytkownika:
```
Jesteś pomocnym asystentem. Preferuj krótkie odpowiedzi, ale jeśli temat
tego wymaga to możesz pisać dłużej. Staraj się być precyzyjny, ale
czasem możesz użyć prostszego języka jeśli to pomoże.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Mieszane sygnały | "krótkie, ale możesz dłużej" - sprzeczne instrukcje |
| "Staraj się" | Nieokreślone - co to znaczy "starać się"? |
| Brak konkretnej roli | "Pomocny asystent" to za mało |
| Brak domeny | Nie wiadomo w czym pomaga |
| Warunkowe instrukcje | "jeśli temat wymaga", "czasem możesz" - niejednoznaczne |

### Zoptymalizowany prompt:

```markdown
## Rola
Jesteś asystentem ds. produktywności dla programistów.

## Styl komunikacji
- Odpowiedzi: 2-4 zdania dla prostych pytań
- Dla złożonych tematów: wprowadzenie + lista kroków + podsumowanie
- Język: techniczny, zakładaj znajomość podstaw programowania

## Priorytet odpowiedzi
1. Bezpośrednia odpowiedź na pytanie
2. Przykład kodu/komendy jeśli dotyczy
3. Link do dokumentacji tylko gdy użytkownik prosi

## Nie rób
- Nie tłumacz podstawowych pojęć (jak pętla, zmienna)
- Nie dodawaj zastrzeżeń typu "pamiętaj że to zależy od kontekstu"
- Nie proponuj alternatyw jeśli użytkownik nie prosi
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto "ale/czasem/możesz" | Jednoznaczne instrukcje zamiast warunkowych |
| Dodano konkretną rolę | "Asystent produktywności dla programistów" |
| Sprecyzowano długość | "2-4 zdania" zamiast "krótkie" |
| Dodano priorytety | Jasna hierarchia co ważniejsze |
| Sekcja "Nie rób" | Konkretne zakazy zamiast "staraj się" |

---

## Przykład 9: Optymalizacja istniejącego promptu (Gemini)

### Oryginalny prompt użytkownika:
```
Jesteś ekspertem od analizy danych. Kiedy dostajesz dane, najpierw
dokładnie je przeanalizuj krok po kroku. Następnie wyciągnij wnioski.
Na końcu zaproponuj rekomendacje. Bądź bardzo szczegółowy i dokładny.
Zwróć uwagę na wszystkie możliwe aspekty danych. Pamiętaj żeby sprawdzić
czy nie ma błędów lub anomalii. Twoja analiza powinna być kompleksowa
i wyczerpująca.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Za długi | Gemini wymaga 30-50% krótszych promptów |
| Ręczny chain of thought | "krok po kroku" - lepiej użyć thinking_level |
| Nadmiarowe wzmocnienia | "bardzo", "dokładnie", "wyczerpująca" - nie pomagają |
| Instrukcje na początku | Gemini preferuje kluczowe instrukcje na końcu |

### Zoptymalizowany prompt:

```markdown
Rola: Analityk danych

Cel: Przeanalizuj podane dane i przygotuj raport

Format raportu:
1. Kluczowe wnioski (3-5 punktów)
2. Anomalie (jeśli występują)
3. Rekomendacje z priorytetami

[DANE TUTAJ]

Skup się na actionable insights dla decyzji biznesowych.
```

**Ustawienia API:**
```
thinking_level: "high"
temperature: 1.0
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Skrócono o ~60% | Gemini działa lepiej z krótszymi promptami |
| Usunięto "krok po kroku" | Zastąpione thinking_level: "high" |
| Usunięto wzmocnienia | "bardzo/dokładnie" nie wpływają na jakość |
| Kluczowa instrukcja na końcu | "Skup się na actionable insights" |
| Prosta struktura | Role + Goal + Format |

---

## Przykład 10: Optymalizacja promptu obrazowego (Nano Banana)

### Oryginalny prompt użytkownika:
```
professional product photography, wireless earbuds, white background,
8k resolution, octane render, hyperrealistic, studio lighting,
volumetric lighting, depth of field, bokeh, sharp focus, ultra detailed,
unreal engine 5, ray tracing, photorealistic render, 35mm lens
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Techniczne parametry | Nano Banana nie rozumie "octane render", "unreal engine" |
| Brak opisu sceny | Same parametry, zero kontekstu wizualnego |
| Nadmiarowe szczegóły | "8k", "ray tracing" - niepotrzebne |
| Styl Midjourney/SD | Nano Banana wymaga naturalnego języka |

### Zoptymalizowany prompt:

```
Eleganckie białe słuchawki bezprzewodowe w otwartym etui ładującym.
Stoją na minimalistycznym białym podłożu.
Profesjonalne oświetlenie studyjne - główne światło z góry,
delikatne wypełnienie z boku podkreślające kształt produktu.
Miękki cień pod etui dodający głębi.
Tło: czyste, gradientowe od białego do jasnoszarego.
Styl: premium product photography jak w reklamie Apple.
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto parametry renderowania | Nano Banana nie używa Octane/Unreal |
| Opisano scenę słowami | Co, gdzie, jak oświetlone |
| Naturalny język | Zamiast keywords - pełne zdania |
| Konkretna inspiracja | "Jak w reklamie Apple" - zrozumiałe |
| Opisano oświetlenie słowami | "Z góry, wypełnienie z boku" zamiast "volumetric" |

---

## Podsumowanie wzorców

| Aspekt | Rozbudowany | Standardowy | Minimalny |
|--------|-------------|-------------|-----------|
| Kontekst | Pełny | Kluczowy | Brak/minimalny |
| Struktura | XML/sekcje | Markdown | Jedno zdanie |
| Przykłady | Tak | Opcjonalnie | Nie |
| Format outputu | Szczegółowy | Zarysowany | Domyślny |
| Dla kogo | Złożone zadania | Większość przypadków | Proste zadania |

---

---

## Przykład 11: Research z Perplexity Pro

### Cel użytkownika:
"Chcę zbadać rynek AI w Polsce"

### PRZED (słaby prompt):
```
Opowiedz o rynku AI w Polsce
```

### PO optymalizacji:

#### Deep Research (Rozbudowany):
```
Deep Research: Analiza rynku sztucznej inteligencji w Polsce 2024-2025.

Zakres:
- Wielkość rynku i dynamika wzrostu (dane liczbowe)
- Główni gracze (polskie startupy AI, globalne firmy z oddziałami w PL)
- Sektory z największą adopcją AI (fintech, e-commerce, produkcja)
- Programy wsparcia (NCBiR, fundusze EU, PFR)

Źródła: raporty PWC, Deloitte, McKinsey, dane GUS, komunikaty prasowe.

Format:
1. Executive summary (5 punktów)
2. Analiza szczegółowa per sektor
3. Tabela porównawcza głównych graczy
4. Prognozy 2025-2027
```

#### Pro Search (Standardowy):
```
Rynek AI w Polsce 2024-2025:
wielkość, główni gracze, sektory z największą adopcją.
Dane z raportów branżowych i oficjalnych statystyk.
Format: podsumowanie + tabela + źródła.
```

#### Quick Search (Minimalny):
```
Największe polskie firmy AI 2024 - lista top 10 z opisem działalności
```

---

## Przykład 12: Fact-checking z Perplexity

### Cel użytkownika:
"Sprawdź czy to prawda"

### PRZED (słaby prompt):
```
Czy to prawda że [twierdzenie]?
```

### PO optymalizacji:

#### Perplexity Pro (Academic Focus):
```
Zweryfikuj twierdzenie: "[dokładne twierdzenie do sprawdzenia]"

Znajdź:
1. Źródła potwierdzające (z datą publikacji)
2. Źródła zaprzeczające (jeśli istnieją)
3. Kontekst - czy twierdzenie jest kompletne czy wyrwane z kontekstu

Oceń wiarygodność na podstawie:
- Jakości źródeł (peer-reviewed vs blog)
- Zgodności między źródłami
- Aktualności danych

Jeśli nie znajdziesz wiarygodnych źródeł - powiedz wprost.
```

---

## Przykład 13: Optymalizacja promptu dla Perplexity

### Oryginalny prompt użytkownika:
```
Jesteś ekspertem od marketingu digitalowego. Powiedz mi wszystko
o najnowszych trendach w social media. Oto przykład dobrej analizy:
[długi przykład]. Teraz zrób podobną analizę dla TikTok.
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| "Jesteś ekspertem" | Role-playing nie działa z wyszukiwarką |
| Few-shot example | Perplexity szuka przykładu zamiast odpowiedzi |
| "Wszystko o..." | Zbyt szerokie zapytanie |
| Brak zakresu czasowego | Nie wiadomo jak aktualne dane |

### Zoptymalizowany prompt:

```
Trendy w marketingu na TikTok Q4 2024 - Q1 2025:

1. Zmiany w algorytmie wpływające na zasięgi
2. Nowe formaty reklamowe i ich skuteczność (CTR, CPA)
3. Case studies marek z branży [Twoja branża]
4. Statystyki demograficzne użytkowników PL

Źródła: oficjalne dane TikTok for Business, raporty Hootsuite/Sprout Social,
case studies z uznanych agencji.

Format: bullet points z konkretnymi liczbami + źródła.
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Usunięto role-playing | Nie działa z wyszukiwarką |
| Usunięto few-shot | Myli algorytm wyszukiwania |
| Dodano zakres czasowy | Q4 2024 - Q1 2025 |
| Sprecyzowano metryki | CTR, CPA zamiast "skuteczność" |
| Określono źródła | Konkretne raporty i portale |
| Format z liczbami | Łatwiejsze do weryfikacji |

---

## Przykład 14: Generowanie obrazu (Grok Aurora)

### Cel użytkownika:
"Zdjęcie produktowe smartwatcha"

### PRZED (słaby prompt):
```
Smartwatch on table
```

### PO optymalizacji:

#### Rozbudowany:
```
Premium smartwatch with dark titanium case floating above minimalist
slate surface, dramatic studio lighting from upper left creating
subtle reflections on sapphire glass, sharp focus on watch face
showing fitness metrics, shallow depth of field with bokeh background,
high-end commercial product photography style, neutral color palette
with subtle blue accent light
```

#### Standardowy:
```
Modern smartwatch on dark slate surface,
professional studio lighting, premium product photography,
sharp details on display, bokeh background, commercial style
```

#### Minimalny:
```
Smartwatch premium product shot, studio lighting,
dark slate surface, commercial photography style
```

### Dlaczego to działa:
- **Subject-first**: Smartwatch na początku
- **Język fotograficzny**: bokeh, depth of field, studio lighting
- **Długość**: ~400 znaków (optymalne dla Aurora)
- **Konkretny styl**: commercial/premium product

---

## Przykład 15: Generowanie wideo (Grok Imagine)

### Cel użytkownika:
"Animacja logo firmy technologicznej"

### PRZED (słaby prompt):
```
Tech logo animation
```

### PO optymalizacji:

#### Rozbudowany:
```
Sleek metallic tech logo materializing from floating particles,
dark studio environment with subtle blue rim lighting,
slow camera push in towards logo, particles coalescing smoothly,
premium corporate video style, dramatic atmosphere,
cinematic shallow depth of field, seamless loop
```

#### Standardowy:
```
Tech logo forming from digital particles,
dark background with blue accent light,
slow zoom in, cinematic corporate style, perfect loop
```

#### Minimalny:
```
Metallic logo reveal animation, particles forming shape,
dark background, blue light, slow zoom, loop
```

### Dlaczego to działa:
- **Ruch explicite opisany**: "materializing", "coalescing", "push in"
- **Proste ruchy**: jedno logo, jeden kierunek kamery
- **Loop zaznaczony**: "seamless loop" dla social media
- **Brak tekstu/rąk**: unikamy problematycznych elementów

---

## Przykład 16: Optymalizacja promptu dla Grok Aurora

### Oryginalny prompt użytkownika:
```
I want a super amazing ultra realistic photograph of a beautiful
young woman with perfect skin and gorgeous eyes standing in a
magical forest with rays of light and butterflies and flowers
everywhere, make it look like a professional photograph with
perfect lighting and colors, maybe add some mist, 8k quality
```

### Analiza problemów:

| Problem | Dlaczego to problem |
|---------|---------------------|
| Zbyt długi i rozwlekły | Aurora optymalna przy 600-700 znaków |
| Wiele podmiotów | Kobieta + las + motyle + kwiaty + mgła = rozproszenie |
| "Beautiful/perfect/amazing" | Puste przymiotniki nie pomagają |
| "8k quality" | Parametr techniczny, Aurora go ignoruje |
| Szczegółowy opis twarzy | Ryzyko zniekształceń |

### Zoptymalizowany prompt:

```
Young woman in enchanted forest at golden hour, soft sunlight
filtering through trees creating volumetric light rays, ethereal
atmosphere with gentle morning mist, natural pose looking
toward light source, shallow depth of field, fine art portrait
photography style, dreamlike mood, warm color palette
```

### Wprowadzone zmiany:

| Zmiana | Powód |
|--------|-------|
| Skrócono o ~40% | Optymalny zakres dla Aurora |
| Usunięto "beautiful/perfect" | Konkretne opisy zamiast przymiotników |
| Jeden główny podmiot | Kobieta w centrum, las jako tło |
| Usunięto motyle/kwiaty | Uproszczenie sceny, więcej fokus |
| Język fotograficzny | "Volumetric rays", "shallow depth of field" |
| Usunięto "8k" | Parametr techniczny niepotrzebny |

---

## Przykład 17: Atmosferyczne wideo (Grok Imagine)

### Cel użytkownika:
"Relaksujące wideo z kominkiem na tło"

### PRZED (słaby prompt):
```
Fireplace video
```

### PO optymalizacji:

#### Rozbudowany:
```
Crackling fireplace flames dancing in cozy living room,
warm amber and orange light flickering on nearby furniture,
static close-up shot of fire, soft wood textures visible,
hygge winter atmosphere, ASMR aesthetic with realistic sound,
perfect seamless loop for ambient display
```

#### Standardowy:
```
Fireplace flames dancing continuously, warm cozy living room,
static close-up, crackling fire ambiance, seamless loop
```

#### Minimalny:
```
Fireplace flames, cozy atmosphere, static shot, perfect loop
```

### Dlaczego to działa:
- **Ruch prosty**: płomienie w jednym miejscu
- **Kamera statyczna**: idealna dla ambient
- **"Seamless loop"**: kluczowe dla tła
- **Nastrój opisany**: "hygge", "ASMR", "cozy"

---

## Podsumowanie optymalizacji

### Najczęstsze błędy do poprawy:

| Błąd | Rozwiązanie |
|------|-------------|
| Mieszane sygnały | Wybierz jedną opcję, usuń "ale", "czasem" |
| Niejasny cel | Sprecyzuj CO i DLA KOGO |
| "Think" dla Claude | Zamień na "consider", "evaluate", "assess" |
| Za długi dla Gemini | Skróć o 30-50%, instrukcje na końcu |
| Parametry techniczne dla Nano Banana | Użyj naturalnego języka |
| Brak formatu outputu | Zawsze określ oczekiwaną strukturę |
| Role-playing dla Perplexity | Usuń "Jesteś ekspertem...", użyj search query |
| Few-shot dla Perplexity | Usuń przykłady, mylą wyszukiwarkę |
| Brak zakresu czasowego (Perplexity) | Dodaj daty: "2024-2025", "Q4 2024" |
| Zbyt długi dla Grok Aurora | Optymalna długość: 600-700 znaków |
| Brak języka fotograficznego (Aurora) | Użyj: bokeh, wide-angle, golden hour |
| Podmiot nie na początku (Aurora) | Subject-first: najważniejszy element pierwszy |
| Złożone ruchy dla Imagine | Proste akcje: walking, turning, floating |
| Brak opisu ruchu kamery (Imagine) | Dodaj: pan, zoom, tracking, static |

### Checklist optymalizacji:
- [ ] Usunięto sprzeczne instrukcje
- [ ] Sprecyzowano cel i odbiorcę
- [ ] Dostosowano do specyfiki modelu
- [ ] Określono format outputu
- [ ] Usunięto nadmiarowe słowa ("bardzo", "dokładnie")
- [ ] Sprawdzono zabronione wzorce (np. "think" dla Claude)
- [ ] Dla Perplexity: brak role-playing i few-shot, dodany zakres czasowy
- [ ] Dla Grok Aurora: subject-first, język fotograficzny, 600-700 znaków
- [ ] Dla Grok Imagine: opisany ruch podmiot+kamera, proste akcje, loop jeśli potrzebny
