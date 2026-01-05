# Szablony Task Promptów

Task prompty to jednorazowe polecenia wykonania konkretnego zadania.

---

## Uniwersalny szablon

```
## Kontekst
[Tło, sytuacja, dlaczego to robisz]

## Zadanie
[Konkretne polecenie - co ma być zrobione]

## Wymagania
- [Wymaganie 1]
- [Wymaganie 2]

## Input
[Dane wejściowe, kod, tekst do analizy]

## Oczekiwany output
[Format i struktura odpowiedzi]
```

---

## Szablony według typu zadania

### Code Review

```
Przeanalizuj poniższy kod pod kątem:
1. Potencjalnych bugów i edge cases
2. Wydajności i optymalizacji
3. Czytelności i maintainability
4. Zgodności z best practices

Kod:
```[język]
[kod do review]
```

Format odpowiedzi:
- Najpierw ogólna ocena (1-2 zdania)
- Lista problemów z priorytetami (krytyczny/średni/niski)
- Konkretne sugestie poprawy z przykładami kodu
```

#### Wersja rozbudowana (Claude 4.5):
```xml
<context>
Projekt: [nazwa]
Technologia: [stack]
Rola kodu: [co robi ten fragment]
</context>

<task>
Przeprowadź szczegółowe code review.
</task>

<code>
[kod]
</code>

<review_criteria>
- Bezpieczeństwo (OWASP Top 10)
- Wydajność (Big O, memory)
- Czytelność (naming, struktura)
- Testy (edge cases, coverage)
- Zgodność z [standardy projektu]
</review_criteria>

<output_format>
## Podsumowanie
[1-2 zdania]

## Problemy krytyczne
[lista z przykładami poprawy]

## Sugestie optymalizacji
[lista z przykładami]

## Pozytywne aspekty
[co jest dobrze zrobione]
</output_format>
```

---

### Debugowanie

```
Mam problem z kodem:

Oczekiwane zachowanie:
[co powinno się dziać]

Aktualne zachowanie:
[co się dzieje]

Error message (jeśli jest):
```
[błąd]
```

Kod:
```[język]
[kod z bugiem]
```

Co już próbowałem:
- [próba 1]
- [próba 2]

Pomóż zdiagnozować przyczynę i zaproponuj rozwiązanie.
```

---

### Napisanie funkcji/kodu

```
Napisz funkcję [nazwa] która:
- [Funkcjonalność 1]
- [Funkcjonalność 2]

Język: [język programowania]
Framework: [jeśli dotyczy]

Wymagania:
- [Wymaganie techniczne]
- [Obsługa błędów]
- [Walidacja]

Przykład użycia:
Input: [przykład]
Output: [oczekiwany wynik]
```

#### Wersja minimalna:
```
Napisz funkcję [język] która [opis działania].
Input: [typ], Output: [typ].
```

---

### Refaktoryzacja

```
Zrefaktoryzuj poniższy kod aby:
- [Cel 1: np. poprawić czytelność]
- [Cel 2: np. wydzielić logikę]
- [Cel 3: np. dodać typowanie]

Zachowaj:
- Istniejące API/interface
- Funkcjonalność (wszystkie testy muszą przechodzić)

Kod:
```[język]
[kod do refaktoryzacji]
```

Zwróć zrefaktoryzowany kod z komentarzami wyjaśniającymi zmiany.
```

---

### Analiza tekstu

```
Przeanalizuj poniższy tekst:

[tekst do analizy]

---

Analiza powinna zawierać:
1. Główną tezę/przesłanie
2. Kluczowe argumenty
3. Ton i styl
4. Grupę docelową
5. Mocne i słabe strony
```

---

### Tłumaczenie

```
Przetłumacz poniższy tekst z [język źródłowy] na [język docelowy].

Styl: [formalny/swobodny/techniczny]
Kontekst: [gdzie będzie użyty - strona www, dokument, UI]

Tekst:
[tekst do tłumaczenia]

Zachowaj:
- Formatowanie (nagłówki, listy)
- Terminy techniczne [lub: przetłumacz terminy techniczne]
- Ton oryginału
```

---

### Podsumowanie

```
Podsumuj poniższy tekst/dokument:

[tekst]

---

Wymagania:
- Długość: [np. 3-5 zdań / 1 akapit / bullet points]
- Skupienie na: [głównych wnioskach / faktach / decyzjach]
- Format: [proza / lista / tabela]
```

#### Wersja minimalna:
```
Podsumuj w 3 punktach:

[tekst]
```

---

### Generowanie treści

```
Napisz [typ treści: artykuł/email/post] o [temat].

Parametry:
- Długość: [słowa/akapity]
- Ton: [formalny/swobodny/przekonujący]
- Grupa docelowa: [kto będzie czytał]
- Cel: [informować/przekonać/rozrywka]

Kluczowe punkty do uwzględnienia:
- [Punkt 1]
- [Punkt 2]

Call to action: [jeśli dotyczy]
```

---

### Porównanie/Analiza decyzyjna

```
Porównaj [Opcja A] vs [Opcja B] w kontekście [sytuacja].

Kryteria porównania:
1. [Kryterium 1]
2. [Kryterium 2]
3. [Kryterium 3]

Kontekst:
- Budżet: [jeśli dotyczy]
- Timeline: [jeśli dotyczy]
- Priorytety: [co najważniejsze]

Format: Tabela porównawcza + rekomendacja z uzasadnieniem
```

---

### Wyjaśnienie koncepcji

```
Wyjaśnij [koncepcja/technologia/termin]:

Poziom odbiorcy: [początkujący/średniozaawansowany/ekspert]
Kontekst: [dlaczego chcę to zrozumieć]

Wyjaśnienie powinno zawierać:
1. Definicję prostymi słowami
2. Analogię z życia codziennego
3. Przykład praktyczny
4. Kiedy to stosować / kiedy nie
```

---

## Adaptery per model

### Claude 4.5 - dodaj strukturę XML:
```xml
<task>...</task>
<input>...</input>
<requirements>...</requirements>
<output_format>...</output_format>
```

### GPT-5.2 - konsoliduj i bądź precyzyjny:
```
[Cały kontekst w jednym bloku]
[Unikaj mieszanych sygnałów]
```

### Gemini 3 - skróć o 30-50%:
```
[Usuń redundancje]
[Kluczowe ograniczenia na końcu]
```

### Grok - uprość do iteracji:
```
[Krótki prompt]
→ [Doprecyzowanie po odpowiedzi]
```

---

## Checklist dla task promptów

- [ ] Jasny, konkretny cel zadania
- [ ] Wszystkie potrzebne dane wejściowe
- [ ] Określone wymagania i ograniczenia
- [ ] Zdefiniowany format outputu
- [ ] Przykład (jeśli format niestandardowy)
- [ ] Dostosowany do docelowego modelu
