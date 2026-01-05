# Nano Banana 2.5 - Najlepsze Praktyki (Generowanie Obrazów)

Źródło: [Google AI Docs](https://ai.google.dev/gemini-api/docs/nanobanana), [Google Blog](https://blog.google/technology/ai/nano-banana-pro/)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Używaj naturalnego języka** - nie technicznych terminów (octane render, unreal engine)
2. **Opisuj scenę** - kto, co, gdzie, jak, jakie światło, jaki nastrój
3. **Bądź konkretny** - im więcej szczegółów, tym lepszy rezultat

### UNIKAJ:
- **Technicznych parametrów** - "8k uhd, hyperdetailed, volumetric lighting" → opisz słowami
- **Negatywnych promptów** - "no blur, no artifacts" → nie działają
- **Zbyt wielu elementów na raz** → iteruj, dodawaj stopniowo

### SZYBKI START:
```
[Podmiot]: Kto/co jest na obrazie
[Działanie]: Co robi
[Lokalizacja]: Gdzie się znajduje
[Oświetlenie]: Jakie światło (np. "złota godzina", "neonowe")
[Styl]: Jaki styl (np. "fotorealizm", "akwarela", "anime")
```

**Przykład:** "Kot perski o białej sierści siedzi na czerwonej aksamitnej poduszce przy kominku. Ciepłe, wieczorne światło lamp. Styl fotorealistyczny."

---

## O modelu

**Nano Banana** (oficjalnie Gemini 2.5 Flash Image) to model do generowania i edycji obrazów od Google DeepMind. Nazwa pochodzi od kodowej nazwy podczas testów na LMArena.

### Wersje:
- **Nano Banana 2.5** - Gemini 2.5 Flash Image (sierpień 2025)
- **Nano Banana Pro** - Gemini 3 Pro Image (listopad 2025)

---

## Kluczowe cechy

- **Prosty język naturalny** - nie wymaga skomplikowanych promptów
- **Spójność postaci** - rozpoznaje tę samą osobę/obiekt w kolejnych generacjach
- **Multi-image fusion** - do 14 obrazów w jednym promptcie
- **World knowledge** - kontekstowo świadome zmiany
- **SynthID** - automatyczny watermark AI

### Limity:
- Do **5 osób** z zachowaniem spójności wyglądu
- Do **14 obrazów** w fuzji
- Automatyczny watermark na wszystkich outputach

---

## Zasady tworzenia promptów

### 1. Używaj naturalnego języka

Nie potrzebujesz technicznych terminów jak w Stable Diffusion czy Midjourney.

**Źle (zbyt techniczne):**
```
photorealistic portrait, 8k uhd, hyperdetailed, volumetric lighting,
octane render, unreal engine 5, 35mm lens, f/1.8, bokeh
```

**Dobrze (naturalny język):**
```
Portret kobiety w średnim wieku z ciepłym uśmiechem,
naturalne światło dzienne, rozmyte tło ogrodu
```

### 2. Opisuj scenę, nie parametry

Skup się na TYM CO widzisz, nie JAK to ma być wyrenderowane.

```
Przytulna kawiarnia w deszczowy dzień. Przez duże okno widać
mokrą ulicę. Na stoliku parująca kawa i otwarta książka.
```

### 3. Bądź konkretny z detalami

Im więcej konkretów, tym lepszy rezultat:

```
Kot perski o białej sierści siedzi na czerwonej aksamitnej
poduszce przy kominku. W tle regał z książkami. Ciepłe,
wieczorne światło lamp.
```

---

## Typy promptów

### Generowanie od zera

```
[Opis sceny/obiektu]

Przykład:
Futurystyczne miasto nocą. Neonowe światła odbijają się
w mokrym asfalcie. Latające samochody między wieżowcami.
Styl cyberpunk.
```

### Edycja istniejącego obrazu

```
[Obraz wejściowy]

Zmień tło na zachód słońca nad oceanem.
Zachowaj postać bez zmian.
```

### Transformacja stylu

```
[Obraz wejściowy]

Przekształć w styl Studio Ghibli - miękkie kolory,
charakterystyczne chmury, bajkowa atmosfera.
```

### Multi-image fusion

```
[Obraz 1: postać] [Obraz 2: tło] [Obraz 3: obiekt]

Połącz postać z obrazu 1 z tłem z obrazu 2.
Dodaj obiekt z obrazu 3 w jej ręce.
```

---

## Spójność postaci

Nano Banana rozpoznaje i utrzymuje spójność do 5 osób:

```
[Zdjęcie referencyjne osoby]

Ta sama osoba w stroju średniowiecznego rycerza,
stojąca przed zamkiem o świcie.
```

```
[Zdjęcia 3 osób]

Te trzy osoby siedzą przy stole w eleganckiej restauracji.
Śmieją się i wznoszą toast.
```

---

## Style i estetyka

### Określanie stylu:

```
Styl: [nazwa stylu]
- fotorealizm
- ilustracja cyfrowa
- akwarela
- pixel art
- anime/manga
- art deco
- minimalizm
- pop art
```

### Przykłady:

```
Portret mężczyzny w stylu renesansowego malarstwa olejnego.
Dramatyczne światłocienie jak u Caravaggia.
```

```
Krajobraz górski w stylu japońskiego drzeworytu ukiyo-e.
Ograniczona paleta kolorów, płaskie cienie.
```

---

## Oświetlenie i atmosfera

Opisuj oświetlenie naturalnie:

```
Oświetlenie:
- "złota godzina" / "zachód słońca"
- "miękkie światło poranne"
- "dramatyczne cienie"
- "światło neonów"
- "przy świecach"
- "zimowy, pochmurny dzień"
```

```
Portret przy oknie. Miękkie światło boczne z lewej strony
tworzy delikatne cienie na twarzy. Tło rozmyte.
```

---

## Kompozycja

Sugeruj kadrowanie:

```
Ujęcie:
- "zbliżenie na twarz"
- "portret do pasa"
- "pełna postać"
- "widok z lotu ptaka"
- "perspektywa żabia"
```

```
Zbliżenie na dłonie garncarza formujące glinę na kole.
Widoczne szczegóły tekstury gliny i zmarszczki na dłoniach.
```

---

## Produkty i przedmioty (e-commerce)

Dla zdjęć produktowych:

```
[Zdjęcie produktu]

Umieść produkt na minimalistycznym białym tle.
Profesjonalne oświetlenie studyjne.
Lekki cień pod produktem.
```

```
[Szkic produktu]

Przekształć szkic w fotorealistyczną wizualizację produktu.
Materiał: szczotkowane aluminium. Tło gradientowe szare.
```

---

## Czego unikać

### NIE używaj:
- Technicznych parametrów renderowania (Octane, Unreal, itp.)
- Zbyt wielu szczegółów na raz
- Negatywnych promptów w stylu SD ("no blur, no artifacts")
- Skomplikowanych instrukcji formatowania

### Problematyczne żądania:
- Rozpoznawalne osoby publiczne (może odmówić)
- Treści kontrowersyjne
- Bardzo szczegółowe anatomiczne opisy

---

## Iteracyjna edycja

Nano Banana wspiera kolejne edycje:

```
Krok 1: [Wygenerowany obraz]
"Zmień kolor sukienki na niebieski"

Krok 2: [Wynik kroku 1]
"Dodaj kapelusz słomkowy"

Krok 3: [Wynik kroku 2]
"Zmień tło na plażę"
```

---

## Porównanie z innymi generatorami

| Aspekt | Nano Banana | Midjourney | DALL-E |
|--------|-------------|------------|--------|
| Język promptu | Naturalny | Techniczny | Naturalny |
| Spójność postaci | Do 5 osób | Ograniczona | Ograniczona |
| Multi-image | Do 14 | 4 | Brak |
| Edycja | Wbudowana | Ograniczona | Wbudowana |
| Watermark | Automatyczny | Brak | Brak |

---

## Checklist dla promptów obrazowych

- [ ] Używam naturalnego języka (nie technicznych parametrów)
- [ ] Opisuję scenę konkretnie (kto, co, gdzie, jak)
- [ ] Określam styl jeśli inny niż fotorealizm
- [ ] Opisuję oświetlenie/atmosferę
- [ ] Sugeruję kadrowanie jeśli ważne
- [ ] Dla edycji - jasno mówię co zmienić a co zachować
- [ ] Dla spójności postaci - załączam referencję
