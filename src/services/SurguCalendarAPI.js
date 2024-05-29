import axios from 'axios'
import CustomError from './CustomError'

class SurguCalendarAPI {
	getSchedule = async search => {
		try {
			let response = await axios.get('/api', {
				params: {
					search: search,
				},
			})

			console.log(response.data)

			return response.data
		} catch (error) {
			console.log(error)
			if (response && response.data && response.data.length < 1)
				throw new CustomError('Не получилось найти расписание;Попробуй изменить поисковый запрос или обратись в службу поддержки')
			else throw new CustomError('Сервер спит;Попробуй обратится в службу поддержки или зайти позже')
		}
	}
}

export default SurguCalendarAPI
