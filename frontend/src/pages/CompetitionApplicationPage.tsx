import FormRenderer from '../components/FormRenderer'
import { competitionFormFields } from '../content/formConfigs'
import { submitCompetition, type CompetitionPayload } from '../lib/api'

export default function CompetitionApplicationPage() {
  return (
    <FormRenderer<CompetitionPayload>
      title="Заявка на участие в конкурсе"
      fields={competitionFormFields}
      submitText="Отправить заявку"
      hint="Заполните информацию о работе/номинации. Мы свяжемся с вами."
      onSubmit={async (payload) => {
        await submitCompetition(payload)
      }}
    />
  )
}

