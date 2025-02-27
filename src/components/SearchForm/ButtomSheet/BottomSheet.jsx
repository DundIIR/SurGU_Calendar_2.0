import {
	Drawer,
	DrawerBody,
	DrawerHeader,
	DrawerOverlay,
	DrawerContent,
	Stack,
	Radio,
	RadioGroup,
	IconButton,
	Spinner,
	Toast,
	useToast,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import closeIcon from '../../../img/close.svg'
import errorIcon from '../../../img/error.svg'
import './_bottom-sheet.scss'
import { useSelector } from 'react-redux'
import SurguCalendarAPI from '../../../services/SurguCalendarAPI'

const normalizeSearchQuery = query => {
	const match = query.match(/^([0-9\-]+)([а-я])?$/i)

	return {
		group: match ? match[1] : query, // Основная часть (без буквы)
		subgroup: match && match[2] ? match[2] : null, // Последняя буква или null
	}
}

const BottomSheet = ({ isOpen, onClose, searchQuery }) => {
	const [selectedValue, setSelectedValue] = useState('')
	const [isChecked, setIsChecked] = useState(true)
	const [options, setOptions] = useState([{ value: 'fullGroup', label: 'Вся группа' }])

	const [notFound, setNotFound] = useState(false)
	const [loading, setLoading] = useState(false)
	const toast = useToast()

	useEffect(() => {
		if (!isOpen) {
			setSelectedValue('0')
			setIsChecked(true)
			setOptions([{ value: '0', label: 'Всё расписание' }])
			setNotFound(false)
		}
		if (isOpen && searchQuery) {
			setLoading(true)
			const api = new SurguCalendarAPI()
			const query = normalizeSearchQuery(searchQuery)
			if (query.subgroup) setSelectedValue(query.subgroup)
			api
				.getSearchCheck(query.group)
				.then(data => {
					if (data && data.length > 0) {
						// Преобразуем данные в нужную структуру
						const formattedOptions = data.map((item, index) => {
							if (item === '0') {
								return { value: '0', label: 'Всё группа' }
							} else {
								return {
									value: item,
									label: `Подгруппа ${item.toUpperCase()}`, // Преобразуем в "Подгруппа A", "Подгруппа Б" и т.д.
								}
							}
						})

						setOptions(formattedOptions)
						setLoading(false)
						setNotFound(false)
					} else {
						setNotFound(true)
					}
				})
				.catch(error => {
					setLoading(false)
					setNotFound(true)
					toast({
						title: 'Ошибка',
						description: error.message || 'Не удалось загрузить данные. Попробуйте обновить страницу.',
						status: 'error',
						duration: 5000,
						isClosable: true,
					})
				})
		}
	}, [isOpen])

	return (
		<Drawer isOpen={isOpen} placement="bottom" onClose={onClose}>
			<DrawerOverlay />
			<DrawerContent minH="500px" borderRadius="30px 30px 0 0" p="24px">
				<header className="drawer-header">
					<span className="drawer-title">{normalizeSearchQuery(searchQuery).group}</span>
					<button onClick={onClose} className="close-btn">
						<img src={closeIcon} />
					</button>
				</header>

				<section className="drawer-body">
					{loading ? (
						<div className="loading-indicator">
							<Spinner className="spinner" />
						</div>
					) : notFound ? (
						<div className="no-results">
							<img src={errorIcon} />
							<p>
								Такого расписания не нашлось
								<br />
								обратитесь в поддержку
							</p>
						</div>
					) : (
						<>
							<RadioGroup onChange={setSelectedValue} value={selectedValue}>
								<Stack gap={1}>
									{options.map(option => (
										<label key={option.value} className={`custom-radio ${selectedValue === option.value ? 'active' : ''}`}>
											<input type="radio" name="group" value={option.value} onChange={() => setSelectedValue(option.value)} />
											<span className="radio-icon"></span>
											{option.label}
										</label>
									))}
								</Stack>
							</RadioGroup>
							<div className="drawer-body__btn">
								<div className="checkbox-wrapper">
									<label className="custom-checkbox">
										<input type="checkbox" checked={isChecked} onChange={() => setIsChecked(!isChecked)} />
										<span className="checkbox-icon"></span>
										Сокращать название дисциплин
										<span className="info-icon"></span>
									</label>
								</div>
								<button onClick={onClose} className="button-add button">
									Добавить в календарь
								</button>
							</div>
						</>
					)}
				</section>
			</DrawerContent>
		</Drawer>
	)
}

export default BottomSheet
