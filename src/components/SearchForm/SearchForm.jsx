import './_search-form.scss'
import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useToast } from '@chakra-ui/react'
import { setQuery } from '../../store/searchSlice'
import BottomSheet from './ButtomSheet/BottomSheet'

const SearchForm = () => {
	const [fieldSearch, setFieldSearch] = useState('')
	const [isOpen, setIsOpen] = useState(false)
	const [searchQuery, setSearchQuery] = useState('')
	const dispatch = useDispatch()

	const handleInputChange = e => {
		let value = e.target.value
		let lastChar = value.slice(-1).toLowerCase()
		const isBackspace = e.nativeEvent.inputType === 'deleteContentBackward'
		let isWordBackspace = e.nativeEvent.inputType === 'deleteWordBackward'

		if (isWordBackspace) {
			value = ''
		} else if (/^\d/.test(value)) {
			if (value.length > 6 && /[а-я]/.test(lastChar)) {
				value = value.slice(0, 6) + lastChar
			} else if (fieldSearch.length == 4 && isBackspace) {
				value = value.slice(0, 2)
			} else if (value.length >= 3) {
				value = value.replace(/\D/g, '')
				value = value.slice(0, 3) + '-' + value.slice(3, 5)
			} else {
				value = value.replace(/\D/g, '')
			}
		} else {
			value = value.replace(/[^а-яА-ЯёЁ. ]/g, '').slice(0, 80)
		}

		setFieldSearch(value)
	}

	const handleSubmit = e => {
		e.preventDefault()
		if (!fieldSearch.trim()) return

		dispatch(setQuery(fieldSearch))
		setSearchQuery(fieldSearch)
		setIsOpen(true)

		setFieldSearch('')
	}

	return (
		<>
			<form className="search-form" onSubmit={handleSubmit}>
				<button type="submit" className="search-form__button"></button>
				<input
					type="text"
					value={fieldSearch}
					onChange={handleInputChange}
					required
					className="search-form__input"
					placeholder="xxx-хх..."
				/>
			</form>

			<BottomSheet isOpen={isOpen} onClose={() => setIsOpen(false)} searchQuery={searchQuery}></BottomSheet>
		</>
	)
}

export default SearchForm
