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
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import closeIcon from '../../../img/close.svg'
import errorIcon from '../../../img/error.svg'
import './_bottom-sheet.scss'
import { useSelector } from 'react-redux'

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

	useEffect(() => {
		if (!isOpen) {
			setSelectedValue('fullGroup')
			setIsChecked(true)
			setOptions([{ value: 'fullGroup', label: 'Вся группа' }])
			setNotFound(false)
		}

		if (searchQuery) {
			setLoading(true)

			setTimeout(() => {
				// Пример имитации ответа от сервера
				const data = {
					subgroups:
						searchQuery.toLowerCase() === '609-11'
							? [
									{ value: 'subgroupA', label: 'Подгруппа А' },
									{ value: 'subgroupB', label: 'Подгруппа Б' },
							  ]
							: [],
				}

				setLoading(false)
				if (data.subgroups && data.subgroups.length > 0) {
					// Если подгруппы найдены, добавляем их в список
					setOptions([{ value: 'fullGroup', label: 'Вся группа' }, ...data.subgroups])
					setNotFound(false)
				} else {
					// Если ничего не найдено
					setNotFound(true)
				}
			}, 1000)
			// fetch(`/api/search?query=${searchQuery}`)
			// 	.then(res => res.json())
			// 	.then(data => {
			// 		setLoading(false)
			// 		if (data.subgroups && data.subgroups.length > 0) {
			// 			setOptions([{ value: 'fullGroup', label: 'Вся группа' }, ...data.subgroups])
			// 			setNotFound(false)
			// 		} else {
			// 			setNotFound(true)
			// 		}
			// 	})
			// 	.catch(() => {
			// 		setLoading(false)
			// 		setNotFound(true)
			// 	})
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
