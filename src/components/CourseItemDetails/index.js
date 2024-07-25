import {Component} from 'react'
import Loader from 'react-loader-spinner'
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css'

import Header from '../Header'

import './index.css'

const apiStatusConstants = {
  success: 'SUCCESS',
  failure: 'FAILURE',
  inProgress: 'IN_PROGRESS',
}

class CourseItemDetails extends Component {
  state = {
    course: {},
    apiStatus: apiStatusConstants.inProgress,
  }

  componentDidMount() {
    this.getCourseData()
  }

  getCourseData = async () => {
    await this.setState({apiStatus: apiStatusConstants.inProgress})

    const {match} = this.props
    const {params} = match
    const {id} = params

    const response = await fetch(`https://apis.ccbp.in/te/courses/${id}`)

    if (response.ok) {
      const singleCourseData = await response.json()
      const updatedSingleCourseData = {
        id: singleCourseData.course_details.id,
        name: singleCourseData.course_details.name,
        imageUrl: singleCourseData.course_details.image_url,
        description: singleCourseData.course_details.description,
      }

      this.setState({
        course: updatedSingleCourseData,
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
    const {course} = this.state
    const {name, imageUrl, description} = course

    return (
      <div className="course-item-inner-container">
        <div className="course-item">
          <img src={imageUrl} alt={name} className="course-item-image" />
          <div className="course-item-details-container">
            <h1 className="course-item-name">{name}</h1>
            <p className="course-item-description">{description}</p>
          </div>
        </div>
      </div>
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
      <button
        type="button"
        className="retry-button"
        onClick={this.getCourseData}
      >
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
      <div className="course-item-container">
        <Header />
        {this.renderAppropriateView()}
      </div>
    )
  }
}

export default CourseItemDetails
