import React from "react";

interface Section {
  id: number;
  title: string;
}

interface FormPageProps {
  progressPercentage: number;
  sections: Section[];
  currentSection: number;
  completedSections: Set<number>;
  handleSectionClick: (index: number) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handlePrevious: () => void;
  handleNext: () => void;
  resetForm: () => void;
  submitted: boolean;
  renderSection: () => React.ReactNode;
}

const FormPage: React.FC<FormPageProps> = ({
  progressPercentage,
  sections,
  currentSection,
  completedSections,
  handleSectionClick,
  handleSubmit,
  handlePrevious,
  handleNext,
  resetForm,
  submitted,
  renderSection,
}) => {
  return (
    <div className="form-container">
      {/* Progress Bar */}
      <div className="progress-container">
        <div className="progress-bar">
          <div
            className="progress-fill"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>

        {/* Section Indicators */}
        <div className="section-indicators">
          {sections.map((section, index) => (
            <div
              key={section.id}
              className={`section-indicator ${
                index === currentSection ? "active" : ""
              } ${completedSections.has(index) ? "completed" : ""}`}
              onClick={() => handleSectionClick(index)}
              style={{
                cursor:
                  index <= Math.max(...Array.from(completedSections), -1) + 1
                    ? "pointer"
                    : "not-allowed",
                opacity:
                  index <= Math.max(...Array.from(completedSections), -1) + 1
                    ? 1
                    : 0.5,
              }}
            >
              {section.title}
            </div>
          ))}
        </div>
      </div>

      {/* Current Section */}
      <form onSubmit={handleSubmit}>
        {renderSection()}

        {/* Navigation */}
        <div className="navigation-container">
          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handlePrevious}
              disabled={currentSection === 0}
            >
              ← Previous
            </button>

            <button
              type="button"
              className="btn btn-outline"
              onClick={resetForm}
            >
              🔄 Reset Form
            </button>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "15px",
              color: "#6c757d",
              fontWeight: "500",
            }}
          >
            Step {currentSection + 1} of {sections.length}
          </div>

          {currentSection === sections.length - 1 ? (
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitted}
              style={{ minWidth: "180px" }}
            >
              {submitted ? "✅ Submitted" : "📄 Submit Registration"}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleNext}
            >
              Next →
            </button>
          )}
        </div>
      </form>

      <div className="form-footer">
        <p>
          © 2025 University Grants Commission, Government of India. All rights
          reserved.
        </p>
        <p>For technical support, contact: support@ugc.ac.in</p>
      </div>
    </div>
  );
};

export default FormPage;
