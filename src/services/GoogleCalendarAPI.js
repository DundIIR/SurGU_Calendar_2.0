import axios from 'axios'
import SurguCalendarAPI from './SurguCalendarAPI'

class GoogleCalendarAPI {
	constructor(providerToken) {
		this.providerToken = providerToken
		this.calendarBaseUrl = 'https://www.googleapis.com/calendar/v3'
		this.timeZone = 'Asia/Yekaterinburg'
	}

	async createCalendar(summary) {
		try {
			console.log('календарь начал создаваться')
			const response = await axios.post(
				`${this.calendarBaseUrl}/calendars`,
				{ summary, timeZone: this.timeZone },
				{
					headers: {
						Authorization: `Bearer ${this.providerToken}`,
						'Content-Type': 'application/json',
					},
				}
			)

			// console.log(response.data)
			console.log('Календарь создан')
			return response.data
		} catch (error) {
			console.error('Ошибка при создании календаря: ', error)
		}
	}

	async createEvent(calendarId, event) {
		try {
			const response = await axios.post(
				`${this.calendarBaseUrl}/calendars/${calendarId}/events`,
				event,
				{
					headers: {
						Authorization: `Bearer ${this.providerToken}`,
						'Content-Type': 'application/json',
					},
				}
			)

			// console.log(response.data)
			console.log('Событие создано')
			return response.data
		} catch (error) {
			console.error('Ошибка при создании события: ', error)
		}
	}

	async importSchedule(search) {
		const surguCalendarAPI = new SurguCalendarAPI()
		const schedule = await surguCalendarAPI.getSchedule(search)
		console.log('запрос корректный')
		try {
			if (schedule && schedule.length > 0) {
				console.log('расписание получено')
				const calendar = await this.createCalendar(search)

				if (calendar && calendar.id) {
					let summary = ''
					let colorId = 0 // Базовый цвет

					for (const lesson of schedule) {
						const start = this.formatDateTime(lesson.datetime_start_lesson)
						const end = this.formatDateTime(lesson.datetime_end_lesson)
						const until = lesson.repetition
						const interval = lesson.interval
							? `;INTERVAL=${lesson.interval}`
							: ''
						if (lesson.summary != summary) {
							summary = lesson.summary
							colorId = colorId === 12 ? 0 : colorId + 1
						}

						const event = {
							summary: lesson.summary,
							location: lesson.location,
							description: lesson.description,
							colorId: colorId,
							start: {
								dateTime: start,
								timeZone: this.timeZone,
							},
							end: {
								dateTime: end,
								timeZone: this.timeZone,
							},
							recurrence: [`RRULE:FREQ=WEEKLY;UNTIL=${until}${interval}`],
						}

						await this.createEvent(calendar.id, event)
					}
				}
			}
		} catch (error) {
			console.log('Ошибка при импорте расписания: ', error)
		}
	}

	formatDateTime(dateTime) {
		return (
			`${dateTime.substring(0, 4)}-${dateTime.substring(
				4,
				6
			)}-${dateTime.substring(6, 8)}T` +
			`${dateTime.substring(9, 11)}:${dateTime.substring(
				11,
				13
			)}:${dateTime.substring(13, 15)}`
		)
	}
}

export default GoogleCalendarAPI

// 	async function createEvent() {
// 		const event = {
// 			summary: 'Леха лепеха',
// 			colorId: '6',
// 			start: {
// 				dateTime: '2024-05-30T08:00:00',
// 				timeZone: 'Asia/Yekaterinburg',
// 			},
// 			end: {
// 				dateTime: '2024-05-30T15:00:00',
// 				timeZone: 'Asia/Yekaterinburg',
// 			},
// 		}

// 		const calendar = {
// 			summary: 'Леха лепеха',
// 		}

// 		console.log(session, supabase)

// 		// await axios
// 		// 	.post(
// 		// 		'https://www.googleapis.com/calendar/v3/calendars/c_bea67e064ea07f863148b72d60f4cddbdcaa9f099f7e4e15465be1f578414b07@group.calendar.google.com/events',
// 		// 		JSON.stringify(event),
// 		// 		{
// 		// 			headers: {
// 		// 				Authorization: 'Bearer ' + session.provider_token,
// 		// 				'Content-Type': 'application/json',
// 		// 			},
// 		// 		},
// 		// 	)
// 		// 	.then(response => {
// 		// 		console.log(response.data)
// 		// 	})
// 		// 	.catch(error => {
// 		// 		console.error('There was an error!', error)
// 		// 	})

// 		// await axios
// 		// 	.post('https://www.googleapis.com/calendar/v3/calendars', JSON.stringify(calendar), {
// 		// 		headers: {
// 		// 			Authorization: 'Bearer ' + session.provider_token,
// 		// 			'Content-Type': 'application/json',
// 		// 		},
// 		// 	})
// 		// 	.then(response => {
// 		// 		console.log(response.data)
// 		// 	})
// 		// 	.catch(error => {
// 		// 		console.error('There was an error!', error)
// 		// 	})
