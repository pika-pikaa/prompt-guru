# Grok Aurora / Imagine - Najlepsze Praktyki

Źródła: [xAI Image Generations](https://docs.x.ai/docs/guides/image-generations), [Grok Imagine Prompt Guide](https://www.grokimagineai.net/prompt-guide)

---

## TL;DR - Najważniejsze

### REGUŁY:
1. **Subject-first** - najważniejszy element na początku promptu
2. **Język fotograficzny** - używaj terminów jak "bokeh", "wide-angle", "golden hour"
3. **Jeden koncept** - skup się na jednej idei, nie mieszaj kontrastujących elementów

### UNIKAJ:
- **Rąk i złożonych ruchów** - klasyczny problem AI, często zniekształcone
- **Tekstu w obrazach/wideo** - często błędny lub nieczytelny
- **Zbyt długich promptów** - optimum 600-700 znaków
- **Wielu kontrastujących elementów** - model traci fokus

### SZYBKI START - OBRAZY:
```
[Podmiot] + [Styl] + [Nastrój] + [Detale]

Przykład: "A confident businesswoman in a modern glass office,
professional headshot, natural window lighting, sharp focus,
corporate style, neutral background"
```

### SZYBKI START - WIDEO:
```
[Podmiot + Ruch] + [Tło + Ruch] + [Kamera + Ruch]

Przykład: "A lone figure walking through a rainy cyberpunk alley,
neon signs reflecting on wet pavement, slow camera pan right,
cinematic mood, night scene"
```

---

## O modelach

### Grok Aurora (Obrazy)
- **Model API**: `grok-2-image`
- **Architektura**: Autoregressive (nie diffusion) - przetwarza sekwencyjnie
- **Endpoint**: `https://api.x.ai/v1/images/generations`
- **Cena**: $0.07 za obraz
- **Kompatybilność**: OpenAI SDK

### Grok Imagine (Wideo)
- **Wersja**: Grok Imagine 0.9 (październik 2025)
- **Długość**: 6-15 sekund
- **FPS**: 24 (50% poprawa vs v0.1)
- **Audio**: Natywna synchronizacja audio-wideo
- **Dostęp**: X Premium ($8/mies.) lub xAI API

### Porównanie możliwości

| Funkcja | Aurora (Obrazy) | Imagine (Wideo) |
|---------|-----------------|-----------------|
| Output | Statyczny obraz | 6-15s klip z audio |
| Fotorealizm | Doskonały | Bardzo dobry |
| Tekst w obrazie | Dobry | Słaby |
| Portrety | Doskonały | Dobry |
| Ruch | N/A | Naturalny, z fizyką |
| Czas generowania | ~5-10s | ~15-20s |

---

## Struktura promptów - Obrazy

### Formuła podstawowa

```
[Podmiot] + [Styl] + [Nastrój/Atmosfera] + [Oświetlenie] + [Detale techniczne]
```

### Elementy promptu

| Element | Przykłady |
|---------|-----------|
| **Podmiot** | "A red vintage Vespa scooter", "A fluffy Persian cat", "A confident CEO" |
| **Styl** | "photorealistic", "watercolor", "cyberpunk", "minimalist", "cinematic" |
| **Nastrój** | "peaceful", "dramatic", "nostalgic", "energetic", "mysterious" |
| **Oświetlenie** | "golden hour", "soft morning light", "neon backlight", "studio lighting" |
| **Kompozycja** | "close-up", "wide shot", "centered", "rule of thirds", "negative space" |

### Aspect Ratios

| Format | Użycie |
|--------|--------|
| **1:1** (Square) | Avatary, produkty, siatki |
| **4:5** (Portrait) | Instagram, mobile |
| **9:16** (Vertical) | Stories, TikTok, Reels |
| **16:9** (Landscape) | YouTube, prezentacje, banery |
| **3:2, 4:3** | Print, plakaty |

Dodaj aspect ratio do promptu, np.: "...landscape format 16:9"

### Optymalna długość

**600-700 znaków** - sweet spot dla Grok Aurora.
- Za krótko → generyczne wyniki
- Za długo → model traci fokus

---

## Struktura promptów - Wideo (Imagine)

### Formuła podstawowa

```
[Podmiot + Ruch] + [Tło + Ruch] + [Kamera + Ruch] + [Styl] + [Atmosfera]
```

### Elementy wideo

| Element | Przykłady |
|---------|-----------|
| **Ruch podmiotu** | "walking slowly", "turning head", "dancing", "running" |
| **Ruch tła** | "clouds drifting", "rain falling", "leaves blowing" |
| **Ruch kamery** | "slow pan right", "zoom in", "tracking shot", "static" |
| **Tempo** | "slow motion", "real-time", "timelapse" |

### Tryby Grok Imagine

| Tryb | Opis | Użycie |
|------|------|--------|
| **Normal** | Zbalansowany, realistyczny | Większość przypadków |
| **Fun** | Kreatywny, dynamiczny | Animacje, efekty |
| **Custom** | Pełna kontrola | Zaawansowani użytkownicy |
| **Spicy** | Odważniejsze treści | NSFW (ograniczenia) |

### Wskazówki dla wideo

1. **Myśl w klipach 6-15s** - nie próbuj opowiedzieć całej historii
2. **Opisz ruch explicite** - "walking", "turning", "flying"
3. **Najpierw obraz, potem wideo** - wygeneruj idealny obraz, potem "Make Video"
4. **Proste ruchy** - unikaj złożonych choreografii
5. **Pętle (loops)** - świetne dla social media

---

## Język fotograficzny i filmowy

### Terminy oświetleniowe

| Termin | Efekt |
|--------|-------|
| **Golden hour** | Ciepłe, miękkie światło zachodu/wschodu |
| **Blue hour** | Chłodne, niebieskie światło przed świtem/po zmierzchu |
| **Backlight** | Światło zza podmiotu, efekt halo |
| **Rim light** | Oświetlenie krawędzi, separacja od tła |
| **Soft light** | Rozproszone, bez ostrych cieni |
| **Hard light** | Ostre, dramatyczne cienie |
| **Neon** | Kolorowe, miejskie oświetlenie |
| **Candlelight** | Ciepłe, intymne |

### Terminy kompozycyjne

| Termin | Efekt |
|--------|-------|
| **Close-up** | Zbliżenie na twarz/detal |
| **Medium shot** | Od pasa w górę |
| **Wide shot** | Pełna postać + otoczenie |
| **Bird's eye view** | Z góry |
| **Worm's eye view** | Z dołu |
| **Dutch angle** | Przekrzywiona kamera |
| **Rule of thirds** | Podmiot w 1/3 kadru |
| **Centered** | Podmiot na środku |
| **Negative space** | Dużo pustej przestrzeni |

### Terminy stylowe

| Termin | Efekt |
|--------|-------|
| **Bokeh** | Rozmyte tło, wyostrzony podmiot |
| **Shallow depth of field** | Mała głębia ostrości |
| **High contrast** | Mocne różnice jasności |
| **Desaturated** | Przygaszone kolory |
| **Vibrant** | Żywe, nasycone kolory |
| **Moody** | Ciemny, atmosferyczny |
| **Dreamy** | Miękki, marzycielski |
| **Gritty** | Surowy, realistyczny |

---

## Iteracja i poprawki

### Zasada jednej zmiany

Gdy wynik nie satysfakcjonuje:
1. **Zmień JEDNĄ rzecz** na raz
2. Porównaj wyniki
3. Powtórz

**Dlaczego?** Jeśli zmienisz 5 rzeczy i obraz się poprawi, nie wiesz która zmiana pomogła.

### Co zmieniać w kolejności

1. **Oświetlenie** - często największy wpływ
2. **Styl** - zmiana estetyki
3. **Kompozycja** - kadrowanie
4. **Detale** - dodaj/usuń elementy
5. **Podmiot** - ostateczność

### Przykład iteracji

```
Próba 1: "A woman in a coffee shop"
→ Za generyczne

Próba 2: "A young woman reading a book in a cozy coffee shop,
morning light through window"
→ Lepiej, ale za ciemne

Próba 3: "A young woman reading a book in a cozy coffee shop,
soft morning light streaming through large window, warm tones"
→ Świetnie!
```

### Follow-up w konwersacji

Grok to chatbot - możesz prosić o zmiany:
- "Make the lighting warmer"
- "Change the background to a beach"
- "Add more contrast"
- "Remove the person in the background"

---

## Czego unikać

### Problematyczne elementy

| Element | Problem | Rozwiązanie |
|---------|---------|-------------|
| **Ręce** | Często zniekształcone | Ukryj lub kadruj bez rąk |
| **Tekst** | Błędna pisownia | Dodaj tekst w post-produkcji |
| **Wiele osób** | Problemy ze spójnością | Max 2-3 osoby |
| **Złożone ruchy** | Nienaturalne | Proste, pojedyncze akcje |
| **Małe detale** | Artefakty | Skup się na głównym podmiocie |

### Antywzorce promptów

```
❌ ŹLE - Za długi i skomplikowany:
"I want you to create an incredibly detailed photorealistic image
of a beautiful woman who is approximately 25 years old with long
flowing blonde hair and piercing blue eyes, she should be wearing
a elegant red dress and standing in front of the Eiffel Tower
during sunset with birds flying in the background and..."

✅ DOBRZE - Konkretny i zwięzły:
"Young blonde woman in red dress, Eiffel Tower at sunset,
golden hour lighting, fashion photography style, full body shot"
```

```
❌ ŹLE - Sprzeczne instrukcje:
"A dark moody scene with bright cheerful colors"

✅ DOBRZE - Spójny nastrój:
"A dark moody scene, deep shadows, desaturated blue tones"
```

```
❌ ŹLE - Zbyt wiele podmiotów:
"A cat, dog, bird, fish, and hamster playing together in a park
with children and adults watching"

✅ DOBRZE - Jeden fokus:
"A golden retriever playing fetch in a sunny park, action shot"
```

---

## Przykłady promptów

### Obrazy - Portret

```
Professional headshot of a confident middle-aged businessman,
modern office background with glass walls, natural window lighting
from the left, sharp focus on eyes, shallow depth of field,
corporate style, neutral color palette
```

### Obrazy - Produkt

```
Sleek wireless earbuds floating above minimalist white surface,
dramatic studio lighting with subtle reflections, premium tech
product photography, clean composition, slight shadow for depth
```

### Obrazy - Krajobraz

```
Misty morning in Japanese bamboo forest, soft diffused light
filtering through tall stems, path leading into fog, serene
and peaceful atmosphere, fine art photography style, 16:9 format
```

### Obrazy - Concept Art

```
Futuristic cyberpunk street market at night, neon signs in
Japanese and English, rain-slicked pavement reflecting lights,
diverse crowd of humans and androids, Blade Runner aesthetic,
cinematic wide shot
```

### Wideo - Akcja

```
A skateboarder performing a kickflip in slow motion,
empty concrete skatepark at golden hour, camera tracking
the movement, dust particles in backlight, urban sports vibe
```

### Wideo - Atmosfera

```
Candle flame flickering gently in dark room, soft warm light
dancing on nearby objects, static close-up shot, peaceful
and meditative mood, ASMR aesthetic
```

### Wideo - Loop

```
Ocean waves gently rolling onto sandy beach, seamless loop,
bird's eye view, turquoise water, white foam patterns,
relaxing tropical atmosphere
```

---

## Grok Aurora vs Nano Banana

| Aspekt | Grok Aurora | Nano Banana |
|--------|-------------|-------------|
| Architektura | Autoregressive | Diffusion |
| Język promptu | Fotograficzny/filmowy | Naturalny, opisowy |
| Długość promptu | 600-700 znaków | Krótszy |
| Tekst w obrazach | Lepszy | Słabszy |
| Wideo | TAK (Imagine) | NIE |
| Spójność postaci | Ograniczona | Do 5 osób |
| Edycja obrazów | TAK | TAK |
| Multi-image | Ograniczone | Do 14 obrazów |
| Dostęp | X Premium / API | Gemini API |

### Kiedy który model?

| Zadanie | Lepszy wybór |
|---------|--------------|
| Fotorealistyczne portrety | Grok Aurora |
| Tekst/logo w obrazie | Grok Aurora |
| Wideo/animacje | Grok Imagine |
| Spójność wielu osób | Nano Banana |
| Naturalny język promptu | Nano Banana |
| Fuzja wielu obrazów | Nano Banana |

---

## Parametry API

### Obrazy (grok-2-image)

| Parametr | Wartości | Opis |
|----------|----------|------|
| `model` | `grok-2-image` | Model do użycia |
| `n` | 1-10 | Liczba obrazów |
| `response_format` | `url` / `b64_json` | Format odpowiedzi |

**Uwaga**: `quality`, `size`, `style` NIE są obecnie wspierane przez xAI API.

### Endpoint

```
POST https://api.x.ai/v1/images/generations
```

Kompatybilny z OpenAI SDK (ten sam base_url).

---

## Checklist przed wysłaniem promptu

### Obrazy
- [ ] Podmiot jest na początku i jasno określony
- [ ] Styl/estetyka jest zdefiniowana
- [ ] Oświetlenie jest opisane
- [ ] Długość: 600-700 znaków (nie za długi)
- [ ] Brak sprzecznych instrukcji
- [ ] Unikam rąk w kadrze (jeśli możliwe)
- [ ] Nie proszę o tekst w obrazie (lub akceptuję błędy)
- [ ] Aspect ratio określony (jeśli ważny)

### Wideo
- [ ] Ruch podmiotu jest explicite opisany
- [ ] Ruch kamery jest określony
- [ ] Długość pasuje do 6-15s
- [ ] Jeden główny koncept (nie złożona historia)
- [ ] Proste ruchy (unikam złożonych choreografii)
- [ ] Wybrany odpowiedni tryb (Normal/Fun/Custom)
