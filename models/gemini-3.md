# Gemini 3 Pro - Najlepsze Praktyki

Źródło: [Google Cloud Docs](https://docs.cloud.google.com/vertex-ai/generative-ai/docs/start/gemini-3-prompting-guide), [Google AI](https://ai.google.dev/gemini-api/docs/prompting-strategies)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Mniej = więcej** - 30-50% krótsze prompty niż dla innych modeli
2. **Krytyczne instrukcje NA KOŃCU** - Gemini przywiązuje większą wagę do końca
3. **Struktura: Role + Goal + Constraints + Format** - prosta i jasna

### UNIKAJ:
- **Zmieniania temperatury!** - ZAWSZE 1.0 (obniżenie = looping, degradacja)
- **Rozbudowanych promptów** - skróć o 30-50%
- **Ręcznego chain of thought** → użyj `thinking_level: "high"` lub `"low"`

### SZYBKI START:
```markdown
Rola: [kim jest AI]

Cel: [co ma zrobić]

Ograniczenia:
- [ograniczenie 1]
- [ograniczenie 2]

Format: [oczekiwany output]
```

---

## Kluczowe cechy Gemini 3

- **Mniej = więcej** - 30-50% krótsze prompty niż dla Gemini 2.x
- **Temperatura 1.0** - NIE obniżać! Optymalizowane pod 1.0
- **Thinking levels** - wbudowane rozumowanie zamiast chain of thought
- **1M tokenów kontekstu** - ogromne okno kontekstowe
- **Multimodal** - tekst, obrazy, audio, video (do 2h)

---

## KRYTYCZNE: Temperatura

**ZAWSZE** używaj domyślnej temperatury 1.0.

Obniżenie temperatury może powodować:
- Looping (powtarzające się odpowiedzi)
- Degradację wydajności w złożonych zadaniach
- Problemy z rozumowaniem matematycznym

```
# W API - NIE ustawiaj temperature poniżej 1.0
# Zostaw domyślną lub jawnie ustaw 1.0
```

---

## Zasady ogólne

### 1. Uprość prompty (30-50% mniej)

Gemini 3 ma "mądrzejsze domyślne ustawienia". Jeśli używałeś rozbudowanych promptów dla Gemini 2.x - skróć je.

**Przed (Gemini 2.x):**
```
Jesteś ekspertem w analizie danych. Twoim zadaniem jest przeanalizowanie
poniższych danych. Proszę, przeanalizuj dane krok po kroku. Najpierw
zidentyfikuj wzorce, następnie wyciągnij wnioski. Pamiętaj, że dokładność
jest kluczowa. Odpowiedz w sposób szczegółowy i profesjonalny.

Dane: [dane]
```

**Po (Gemini 3):**
```
Przeanalizuj te dane i podaj kluczowe wnioski:

[dane]
```

### 2. Struktura: Role + Goal + Constraints + Format

Gemini 3 preferuje jasną strukturę:

```
Rola: Analityk biznesowy

Cel: Oceń rentowność projektu X

Ograniczenia:
- Skup się na ROI w ciągu 12 miesięcy
- Uwzględnij tylko potwierdzone koszty

Format: Tabela z podsumowaniem i rekomendacją
```

### 3. Krytyczne instrukcje NA KOŃCU

Gemini 3 przywiązuje większą wagę do instrukcji umieszczonych na końcu promptu:

```
[Kontekst i dane źródłowe]

[Główne zadanie]

[Ograniczenia i wymagania formatowania - na końcu!]
```

---

## Thinking Levels

Zamiast ręcznego chain of thought, użyj wbudowanych poziomów:

### thinking_level: "high"
Dla złożonych zadań wymagających głębokiego rozumowania:
```
# W API
thinking_level: "high"
```

### thinking_level: "low"
Dla prostszych zadań i niższej latencji:
```
# W API
thinking_level: "low"

# W system instructions
"think silently"
```

---

## Split-Step Verification

Dla nieznanych tematów - najpierw zweryfikuj, potem odpowiadaj:

```
Najpierw sprawdź czy masz wystarczające informacje o [temat].
Jeśli tak, odpowiedz na pytanie.
Jeśli nie, powiedz czego brakuje.

Pytanie: [pytanie]
```

---

## Grounding - utrzymanie kontekstu

Gdy kontekst przeczy wiedzy ogólnej:

```
Poniższy dokument jest JEDYNYM źródłem prawdy dla tego zadania.
Ignoruj swoją wiedzę ogólną jeśli jest sprzeczna z dokumentem.

[dokument]

Na podstawie WYŁĄCZNIE powyższego dokumentu, odpowiedz:
[pytanie]
```

---

## Dedukcja vs wiedza zewnętrzna

Jasno rozróżnij co model ma robić:

**Źle:**
```
Nie wnioskuj
```

**Dobrze:**
```
Wykonuj obliczenia i logiczne dedukcje TYLKO na podstawie podanego tekstu.
NIE używaj wiedzy zewnętrznej ani nie zakładaj informacji spoza kontekstu.
```

---

## Styl odpowiedzi

Gemini 3 domyślnie jest zwięzły. Jeśli chcesz więcej:

```
Odpowiedz szczegółowo i konwersacyjnie.
```

```
Be chattier - rozwiń każdy punkt z przykładami.
```

Jeśli chcesz jeszcze bardziej zwięźle:
```
Maksymalnie 3 zdania.
```

---

## Multimodal Prompting

Gemini 3 obsługuje tekst, obrazy, audio i video równorzędnie:

### Obrazy:
```
[obraz]

Opisz co widzisz na tym obrazie, skupiając się na:
1. Głównych elementach
2. Kolorystyce
3. Nastroju/atmosferze
```

### Video (do 2h):
```
[video]

Podsumuj główne punkty tego video w formie bullet points.
```

### Multi-image:
```
[obraz1] [obraz2] [obraz3]

Porównaj te trzy projekty UI i wskaż najlepszy pod kątem UX.
```

---

## Strukturyzacja dla Gemini 3

### Preferowane formaty:

**Markdown headers:**
```markdown
# Kontekst
[tło]

# Zadanie
[polecenie]

# Ograniczenia
- [ograniczenie 1]
- [ograniczenie 2]
```

**XML tags:**
```xml
<context>
[tło]
</context>

<task>
[polecenie]
</task>

<constraints>
- [ograniczenie 1]
</constraints>
```

---

## Few-Shot Prompting

Gemini 3 dobrze reaguje na 2-3 przykłady:

```
Klasyfikuj sentiment recenzji.

Przykład:
Input: "Produkt świetny, polecam!"
Output: POZYTYWNY

Przykład:
Input: "Totalny zawód, pieniądze wyrzucone w błoto"
Output: NEGATYWNY

Teraz:
Input: "[recenzja]"
Output:
```

---

## Parametry API

| Parametr | Rekomendacja |
|----------|--------------|
| Model | `gemini-3-pro` |
| Temperature | **1.0 (NIE ZMIENIAJ!)** |
| Max tokens | Do 64k output |
| Context | Do 1M tokenów |
| Thinking level | high/low wg potrzeb |

---

## Gemini 3 vs inne modele

| Aspekt | Gemini 3 | Inne |
|--------|----------|------|
| Długość promptu | Krótsze | Dłuższe |
| Temperatura | 1.0 zawsze | Zmienna |
| Chain of thought | thinking_level | Manualny |
| Kontekst | 1M tokenów | Mniejszy |
| Multimodal | Natywny | Ograniczony |

---

## Checklist przed wysłaniem promptu

- [ ] Prompt jest zwięzły (30-50% krótszy niż dla innych modeli)
- [ ] Temperatura = 1.0 (lub domyślna)
- [ ] Struktura: Role + Goal + Constraints + Format
- [ ] Krytyczne instrukcje na końcu
- [ ] Ustawiony odpowiedni thinking_level
- [ ] Jasne rozróżnienie dedukcji vs wiedzy zewnętrznej
- [ ] Kontekst/dane przed pytaniami
