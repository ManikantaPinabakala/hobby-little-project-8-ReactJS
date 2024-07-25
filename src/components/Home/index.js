import {Component} from 'react'
import {Link} from 'react-router-dom'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class Home extends Component {
  state = {
    courseList: [],
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getData()
  }

  getData = async () => {
    await this.setState({apiStatus: apiStatusConstants.inProgress})

    const response = await fetch('https://apis.ccbp.in/te/courses')

    if (response.ok) {
      const data = await response.json()
      const {courses} = data
      const updatedCoursesData = courses.map(eachCourse => ({
        id: eachCourse.id,
        name: eachCourse.name,
        logoUrl: eachCourse.logo_url,
      }))

      this.setState({
        courseList: updatedCoursesData,
        apiStatus: apiStatusConstants.success,
      })
    } else {
      this.setState({apiStatus: apiStatusConstants.failure})
    }
  }

  renderLoader = () => (
    <div data-testid="loader" className="loader-container">
      <Loader type="ThreeDots" color="#4656a1" height="80" width="80" />
    </div>
  )

  renderSuccessView = () => {
    const {courseList} = this.state

    return (
      <>
        <h1 className="courses-heading">Courses</h1>
        <ul className="course-list">
          {courseList.map(eachCourse => (
            <li className="course-list-item" key={eachCourse.id}>
              <Link to={`/courses/${eachCourse.id}`} className="link-element">
                <img
                  src={eachCourse.logoUrl}
                  alt={eachCourse.name}
                  className="course-logo"
                />
                <p className="course-name">{eachCourse.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </>
    )
  }

  renderFailureView = () => (
    <div className="failure-view-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/tech-era/failure-img.png"
        alt="failure view"
        className="failure-image"
      />
      <h1 className="failure-headline-text">Oops! Something Went Wrong</h1>
      <p className="failure-description">
        We cannot seem to find the page you are looking for.
      </p>
      <button type="button" className="retry-button" onClick={this.getData}>
        Retry
      </button>
    </div>
  )

  renderAppropriateView = () => {
    const {apiStatus} = this.state

    switch (apiStatus) {
      case apiStatusConstants.success:
        return this.renderSuccessView()
      case apiStatusConstants.failure:
        return this.renderFailureView()
      default:
        return this.renderLoader()
    }
  }

  render() {
    return (
      <div className="home-container">
        <Header />
        <div className="home-content-container">
          {this.renderAppropriateView()}
        </div>
      </div>
    )
  }
}

export default Home
