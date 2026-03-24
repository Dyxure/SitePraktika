import FormRenderer from '../components/FormRenderer'
import { learningFormFields } from '../content/formConfigs'
import { submitLearning, type LearningPayload } from '../lib/api'

export default function LearningApplicationPage() {
  return (
    <FormRenderer<LearningPayload>
      title="Заявка на обучение"
      fields={learningFormFields}
      submitText="Отправить заявку"
      hint="Мы ответим по телефону. Отправка уходит на email и в Telegram."
      onSubmit={async (payload) => {
        await submitLearning(payload)
      }}
    />
  )
}

