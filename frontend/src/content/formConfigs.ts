export type FieldType = 'text' | 'tel' | 'email' | 'number' | 'textarea' | 'select'

// Конфигурация полей формы: дизайнер/практикант может менять набор полей,
// а компонент `FormRenderer` сам отрисует UI.
export type FormField = {
  id: string
  name: string
  label: string
  type: FieldType
  required?: boolean
  placeholder?: string
  options?: { value: string; label: string }[]
}

export const learningFormFields: FormField[] = [
  { id: 'parent_name', name: 'parentName', label: 'Имя родителя', type: 'text', required: true, placeholder: 'Например, Анна' },
  { id: 'parent_phone', name: 'parentPhone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 ...' },
  { id: 'child_name', name: 'childName', label: 'Имя ребёнка', type: 'text', required: true, placeholder: 'Например, Иван' },
  { id: 'child_age', name: 'childAge', label: 'Возраст ребёнка', type: 'number', required: true, placeholder: 'Например, 7' },
  {
    id: 'direction',
    name: 'direction',
    label: 'Направление / курс',
    type: 'select',
    required: true,
    options: [
      { value: 'Керамика', label: 'Керамика' },
      { value: 'Ткачество', label: 'Ткачество' },
      { value: 'Мастерская игрушки', label: 'Мастерская игрушки' },
    ],
  },
  { id: 'comment', name: 'comment', label: 'Комментарий', type: 'textarea', placeholder: 'Необязательно' },
]

export const competitionFormFields: FormField[] = [
  { id: 'participant_name', name: 'participantName', label: 'ФИО участника / родителя', type: 'text', required: true, placeholder: 'Например, Иванова Мария' },
  { id: 'phone', name: 'phone', label: 'Телефон', type: 'tel', required: true, placeholder: '+7 ...' },
  { id: 'email', name: 'email', label: 'Email', type: 'email', required: true, placeholder: 'name@example.com' },
  { id: 'age', name: 'age', label: 'Возраст / категория', type: 'text', required: true, placeholder: 'Например, 8 лет / младшая группа' },
  { id: 'work_title', name: 'workTitle', label: 'Название работы / номинация', type: 'text', required: true, placeholder: 'Как называется работа' },
  { id: 'additional', name: 'additional', label: 'Комментарий / дополнительная информация', type: 'textarea', placeholder: 'Необязательно' },
]

