import type { ArtifactMenuItem } from "./types";

export const ARTIFACT_MENU: ArtifactMenuItem[] = [
  // epistemic — I figured something out (proof of thinking)
  {
    id: "discovery",
    category: "epistemic",
    label: "Понял что-то",
    emoji: "💡",
    hint: "Инсайт, вывод, ответ на вопрос",
  },
  {
    id: "what_failed",
    category: "epistemic",
    label: "Понял что не работает",
    emoji: "🚫",
    hint: "Тупик — тоже прогресс. Зафиксируй",
  },
  {
    id: "clearer_map",
    category: "epistemic",
    label: "Прояснил картину",
    emoji: "🗺️",
    hint: "Нарисовал схему, составил список, разобрал структуру",
  },
  {
    id: "question_answered",
    category: "epistemic",
    label: "Нашёл ответ",
    emoji: "🔍",
    hint: "Нашёл информацию, прочитал, изучил",
  },

  // pragmatic — I made something tangible (proof of doing)
  {
    id: "thing_created",
    category: "pragmatic",
    label: "Создал что-то",
    emoji: "✨",
    hint: "Файл, экран, набросок, документ",
  },
  {
    id: "code_written",
    category: "pragmatic",
    label: "Написал код",
    emoji: "💻",
    hint: "Функция, компонент, скрипт — любой кусок",
  },
  {
    id: "sent_something",
    category: "pragmatic",
    label: "Отправил / опубликовал",
    emoji: "📤",
    hint: "Письмо, сообщение, пост, PR — что-то вышло наружу",
  },
  {
    id: "tried_differently",
    category: "pragmatic",
    label: "Попробовал по-другому",
    emoji: "🔄",
    hint: "Не сработало → изменил подход → попробовал снова",
  },

  // regulation — I moved despite resistance (proof of starting)
  {
    id: "first_step",
    category: "regulation",
    label: "Сделал первый шаг",
    emoji: "🚀",
    hint: "Открыл, начал, сдвинул с мёртвой точки",
  },
  {
    id: "brain_dump",
    category: "regulation",
    label: "Выгрузил из головы",
    emoji: "🧠",
    hint: "Выписал всё что мешает — голова освободилась",
  },
];

export const CATEGORY_LABELS: Record<string, string> = {
  epistemic: "Понял",
  pragmatic: "Сделал",
  regulation: "Сдвинулся",
};

export const CATEGORY_DESCRIPTIONS: Record<string, string> = {
  epistemic: "Доказательство мышления",
  pragmatic: "Доказательство действия",
  regulation: "Преодолел сопротивление",
};

export const TIMER_DURATIONS = [5, 10, 15, 20, 25] as const;
