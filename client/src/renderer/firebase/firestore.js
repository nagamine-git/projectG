import Firebase from '@firebase/app'
import firebaseConfig from './firebaseConfig'

import 'firebase/firestore'

const firebaseApp = Firebase.initializeApp(firebaseConfig)
const firestore = firebaseApp.firestore()
firestore.settings({ timestampsInSnapshots: true })

export default firestore
