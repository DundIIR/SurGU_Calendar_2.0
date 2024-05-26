import './_fileSchedule.scss'
import plus from '../../img/plus.gif'
import {
	Button,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Tooltip,
	useDisclosure,
} from '@chakra-ui/react'
import FileScheduleItem from '../FileScheduleItem/FileScheduleItem'
import { useSession } from '@supabase/auth-helpers-react'
import GoogleCalendarAPI from '../../services/GoogleCalendarAPI'
import { useState } from 'react'
import SurguCalendarAPI from '../../services/SurguCalendarAPI'

const FileSchedule = ({ searches }) => {
	const { isOpen, onOpen, onClose } = useDisclosure()

	const [title, setTitle] = useState('')
	// const [searchesList, setSearchesList] = useState([])
	// const title = '609-11'

	// const FieldList = () => {
	// 	return searches.map((search, index) => (
	// 		<FileScheduleItem
	// 			key={index}
	// 			title={search}
	// 			setTitle={setTitle}
	// 			onOpen={onOpen}
	// 		/>
	// 	))
	// }

	return (
		<section className='page-main__files file-schedule'>
			<h2 className='visually-hidden'>Список файлов с расписанием</h2>
			<ul className='file-schedule__list'>
				{searches.map((search, index) => (
					<FileScheduleItem
						key={index}
						title={search}
						setTitle={setTitle}
						onOpen={onOpen}
					/>
				))}
			</ul>
			<VerticallyCenter isOpen={isOpen} onClose={onClose} title={title} />
		</section>
	)
}

function VerticallyCenter({ isOpen, onClose, title }) {
	const session = useSession()

	const body = session
		? `Также можно экспортировать файл с расписанием`
		: `Также можно сразу добавить расписание в Google Calendar. <br/> Для этого нужно войти в аккаунт.`

	const handleAddToCalendar = () => {
		if (session) {
			console.log('Запрос отправлен')
			const googleCalendarAPI = new GoogleCalendarAPI(session.provider_token)
			console.log(title)
			googleCalendarAPI.importSchedule(title)
			// const temp = new SurguCalendarAPI()
			// console.log(temp.getSchedule(title))
		}
	}

	return (
		<>
			<Modal onClose={onClose} isOpen={isOpen} isCentered>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						Расписание группы: <br />
						{title}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>{body}</ModalBody>
					<ModalFooter mt={4}>
						<Tooltip
							label='Начнет загрузку расписания в Календарь'
							placement='top'
						>
							<Button
								mr='2'
								bg='green.300'
								_hover={{ bg: 'green.400' }}
								onClick={handleAddToCalendar}
							>
								{session ? 'Добавить в Google Calendar' : 'Экспортировать файл'}
							</Button>
						</Tooltip>
						<Tooltip label='Удалит плашку из списка' placement='top'>
							<Button onClick={onClose} bg='red.300' _hover={{ bg: 'red.500' }}>
								Удалить
							</Button>
						</Tooltip>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}

export default FileSchedule
