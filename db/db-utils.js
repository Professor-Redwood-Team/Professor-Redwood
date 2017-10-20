// Generic template finding something in the model asynchronously

function findInModel(model, condition, select, limit) {
	return new Promise((resolve, reject) => {
		model.
			find(condition).
			select(select).
			limit(limit).
			exec((err, result) => {
				if (err) reject(err)
				if (result) resolve(result)
				if (result.length > 1) reject(`No results based on ${condition}`)
			})
	})
}

function findOne(model, condition, select) {
	return new Promise((resolve, reject) => {
		model.
			findOne(condition).
			select(select).
			exec((err, result) => {
				if (err) reject (err)
				if (!result) reject(`No result based on ${condition}`)
				if (result) resolve(result)				
			})
	})
}

module.exports = {
	findInModel,
	findOne
}