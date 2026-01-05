# Claude 4.5 Opus / Sonnet - Najlepsze Praktyki

Źródło: [Oficjalna dokumentacja Anthropic](https://platform.claude.com/docs/en/build-with-claude/prompt-engineering/claude-4-best-practices)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Bądź EXPLICITE** - Claude robi dokładnie to co piszesz, nic więcej, nic mniej
2. **Używaj XML tagów** dla struktury (`<task>`, `<context>`, `<output_format>`)
3. **Dodawaj kontekst/motywację** - wyjaśnij DLACZEGO, nie tylko CO

### UNIKAJ:
- Słowa **"think"** (bez extended thinking) → użyj "consider", "evaluate", "assess"
- **Over-engineeringu** (szczególnie Opus) → dodaj `<avoid_overengineering>`
- **Niejasnych instrukcji** → Claude nie zgaduje, bierze dosłownie

### SZYBKI START:
```xml
<context>[Tło i sytuacja]</context>
<task>[Konkretne polecenie]</task>
<constraints>[Ograniczenia]</constraints>
<output_format>[Oczekiwany format]</output_format>
```

---

## Kluczowe cechy modeli Claude 4.x

- **Precyzyjne wykonywanie instrukcji** - robi dokładnie to, co prosisz, nic więcej
- **Wysoka dosłowność** - wcześniejsze modele inferowały intencje, Claude 4.x bierze dosłownie
- **Doskonałe śledzenie stanu** - świetny w długich sesjach i multi-context workflows
- **Agresywne parallel tool calling** - szczególnie Sonnet 4.5

---

## Zasady ogólne

### 1. Bądź EXPLICITE z instrukcjami

Claude 4.x wymaga jasnych, bezpośrednich instrukcji. Jeśli chcesz "więcej" - poproś o to wprost.

**Źle:**
```
Stwórz dashboard analityczny
```

**Dobrze:**
```
Stwórz dashboard analityczny. Uwzględnij jak najwięcej funkcji i interakcji.
Wyjdź poza podstawy i stwórz w pełni funkcjonalną implementację.
```

### 2. Dodawaj kontekst i motywację

Wyjaśnienie DLACZEGO pomaga Claude lepiej zrozumieć cel.

**Źle:**
```
NIGDY nie używaj wielokropków
```

**Dobrze:**
```
Twoja odpowiedź będzie odczytywana przez silnik text-to-speech,
więc nigdy nie używaj wielokropków, ponieważ silnik nie wie jak je wymówić.
```

### 3. Uważaj na przykłady

Claude 4.x zwraca szczególną uwagę na przykłady. Upewnij się, że przykłady odzwierciedlają pożądane zachowanie.

---

## KRYTYCZNE: Unikaj słowa "think"

Gdy extended thinking jest WYŁĄCZONE, Claude Opus 4.5 jest bardzo wrażliwy na słowo "think" i jego warianty.

### Zamienniki dla "think":
| Unikaj | Używaj zamiast |
|--------|----------------|
| think | consider, evaluate, assess |
| think about | reflect on, examine |
| think through | work through, analyze |
| thinking | reasoning, evaluating |

---

## Strukturyzacja promptów - XML tagi

Claude 4.x doskonale reaguje na XML tagi do organizacji promptu:

```xml
<context>
Pracujesz jako senior developer w projekcie e-commerce.
</context>

<task>
Zoptymalizuj funkcję obliczającą koszyk zakupowy.
</task>

<constraints>
- Zachowaj kompatybilność z istniejącym API
- Maksymalny czas wykonania: 100ms
- Nie dodawaj zewnętrznych zależności
</constraints>

<output_format>
Zwróć zoptymalizowany kod z komentarzami wyjaśniającymi zmiany.
</output_format>
```

---

## Techniki specyficzne

### Parallel Tool Calling

Claude 4.x (szczególnie Sonnet) agresywnie wykonuje narzędzia równolegle. Zachęcaj do tego:

```
<use_parallel_tool_calls>
Jeśli zamierzasz wywołać wiele narzędzi i nie ma między nimi zależności,
wywołaj wszystkie niezależne narzędzia równolegle. Maksymalizuj użycie
równoległych wywołań gdzie to możliwe.
</use_parallel_tool_calls>
```

### Extended Thinking

Dla złożonych zadań włącz extended thinking i kieruj rozumowaniem:

```
Po otrzymaniu wyników narzędzi, dokładnie przeanalizuj ich jakość
i określ optymalne następne kroki przed kontynuowaniem. Użyj swojego
rozumowania do planowania i iteracji.
```

### Unikanie Over-engineeringu (Opus 4.5)

Opus ma tendencję do nadmiernego rozbudowywania. Dodaj:

```
<avoid_overengineering>
Unikaj over-engineeringu. Wprowadzaj tylko zmiany bezpośrednio żądane
lub wyraźnie niezbędne. Utrzymuj rozwiązania proste i skupione.

Nie dodawaj funkcji, nie refaktoryzuj kodu, nie wprowadzaj "usprawnień"
poza tym, o co proszono. Poprawka buga nie wymaga porządkowania
otaczającego kodu.

Nie twórz helperów, utilities ani abstrakcji dla jednorazowych operacji.
Nie projektuj pod hipotetyczne przyszłe wymagania.
</avoid_overengineering>
```

### Zachęcanie do eksploracji kodu

Opus może być zbyt konserwatywny. Dodaj:

```
ZAWSZE czytaj i rozumiej odpowiednie pliki przed proponowaniem edycji.
Nie spekuluj o kodzie, którego nie przejrzałeś. Jeśli użytkownik
wskazuje konkretny plik, MUSISZ go otworzyć i przejrzeć przed
wyjaśnianiem lub proponowaniem poprawek.
```

---

## Kontrola formatu odpowiedzi

### Mów co robić, nie czego nie robić

**Źle:** "Nie używaj markdown w odpowiedzi"

**Dobrze:** "Twoja odpowiedź powinna składać się z płynnych akapitów prozy."

### XML dla formatowania

```
Pisz sekcje prozą w tagach <smoothly_flowing_prose_paragraphs>.
```

### Minimalizacja markdown

```
<avoid_excessive_markdown>
Pisz czytelnym, płynnym tekstem używając kompletnych akapitów.
Używaj standardowych podziałów akapitów. Rezerwuj markdown głównie
dla `inline code`, bloków kodu i prostych nagłówków.

NIE używaj list numerowanych ani punktorów chyba że prezentujesz
naprawdę dyskretne elementy gdzie lista jest najlepszą opcją.
</avoid_excessive_markdown>
```

---

## Parametry API

| Parametr | Rekomendacja |
|----------|--------------|
| Model string (Opus) | `claude-opus-4-5-20250929` |
| Model string (Sonnet) | `claude-sonnet-4-5-20250929` |
| Temperature | Domyślna (nie zmieniaj bez powodu) |
| Max tokens | Dostosuj do zadania |
| Extended thinking | Włącz dla złożonych zadań |

---

## Prompt do proaktywnego działania

Jeśli chcesz aby Claude sam podejmował akcje:

```
<default_to_action>
Domyślnie implementuj zmiany zamiast tylko je sugerować.
Jeśli intencja użytkownika jest niejasna, wywnioskuj najbardziej
użyteczną akcję i kontynuuj, używając narzędzi do odkrycia
brakujących szczegółów zamiast zgadywać.
</default_to_action>
```

## Prompt do ostrożnego działania

Jeśli chcesz aby Claude był ostrożny:

```
<do_not_act_before_instructions>
Nie skacz do implementacji ani nie zmieniaj plików bez wyraźnej
instrukcji. Gdy intencja jest niejednoznaczna, domyślnie dostarczaj
informacje i rekomendacje zamiast podejmować akcje.
</do_not_act_before_instructions>
```

---

## Checklist przed wysłaniem promptu

- [ ] Instrukcje są explicite i konkretne
- [ ] Dodano kontekst/motywację gdzie potrzebne
- [ ] Brak słowa "think" (jeśli bez extended thinking)
- [ ] Użyto XML tagów dla struktury
- [ ] Przykłady są spójne z oczekiwanym zachowaniem
- [ ] Określono format outputu
- [ ] Dodano ograniczenia (jeśli potrzebne)
