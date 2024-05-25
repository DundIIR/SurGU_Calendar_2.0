import axios from 'axios'

class SurguCalendarAPI {
	getSchedule = async search => {
		try {
			let response = await axios.get('/api', {
				params: {
					search: search,
				},
			})

			// console.log(response.data)
			return response.data
			// return [
			// 	{
			// 		datetime_start_lesson: '20240304T083000',
			// 		datetime_end_lesson: '20240304T095000',
			// 		repetition: '20240601T235959Z',
			// 		interval: '',
			// 		create: '20240520',
			// 		location: 'К406 Лекционное занятие',
			// 		summary: 'WEB',
			// 		description: 'Кузин Д.А.',
			// 		subgroup: '609-11 None',
			// 	},
			// 	{
			// 		datetime_start_lesson: '20240312T083000',
			// 		datetime_end_lesson: '20240312T095000',
			// 		repetition: '20240601T235959Z',
			// 		interval: 2,
			// 		create: '20240520',
			// 		location: 'К401 Лабораторное занятие',
			// 		summary: 'WEB',
			// 		description: 'Кузин Д.А.',
			// 		subgroup: '609-11 а',
			// 	},
			// 	{
			// 		datetime_start_lesson: '20240306T083000',
			// 		datetime_end_lesson: '20240306T095000',
			// 		repetition: '20240601T235959Z',
			// 		interval: 2,
			// 		create: '20240520',
			// 		location: 'К401 Лабораторное занятие',
			// 		summary: 'Физика',
			// 		description: 'Кузин Д.А.',
			// 		subgroup: '609-11 а',
			// 	},
			// ]
		} catch (e) {
			console.log(e)
		}
	}
}

export default SurguCalendarAPI
