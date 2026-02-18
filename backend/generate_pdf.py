from fpdf import FPDF
import os

class PDF(FPDF):
    def header(self):
        self.set_font('Arial', 'B', 15)
        self.cell(0, 10, 'TCS NQT Prep Material - Quantitative Aptitude', 0, 1, 'C')
        self.ln(10)

    def footer(self):
        self.set_y(-15)
        self.set_font('Arial', 'I', 8)
        self.cell(0, 10, 'Page ' + str(self.page_no()) + '/{nb}', 0, 0, 'C')

def create_pdf():
    pdf = PDF()
    pdf.alias_nb_pages()
    pdf.add_page()
    pdf.set_font('Arial', '', 12)

    questions = [
        {
            "q": "1. If a train travels 60 km in 1.5 hours, what is its speed in km/hr?",
            "options": ["30", "40", "45", "60"],
            "correct": "B"
        },
        {
            "q": "2. The average of 6 numbers is 15. If one number is excluded, the average becomes 14. What is the excluded number?",
            "options": ["18", "20", "21", "24"],
            "correct": "C"
        },
        {
            "q": "3. A car travels 120 km at a speed of 40 km/hr and returns at a speed of 60 km/hr. What is the average speed for the entire journey?",
            "options": ["48 km/hr", "52 km/hr", "50 km/hr", "55 km/hr"],
            "correct": "A"
        },
        {
            "q": "4. What sum of money will amount to 6600 in 3 years at 10% per annum simple interest?",
            "options": ["5000", "6000", "5500", "4800"],
            "correct": "B"
        },
        {
            "q": "5. What is the smallest number that must be multiplied by 84 to make it a perfect square?",
            "options": ["3", "6", "21", "7"],
            "correct": "B"
        },
        {
            "q": "6. An article is sold at a profit of 20%. If the selling price is 720, what is the cost price?",
            "options": ["600", "620", "680", "660"],
            "correct": "A"
        },
        {
            "q": "7. A student scored 30% in an exam and failed by 20 marks. If the passing marks are 40%, what are the maximum marks of the exam?",
            "options": ["100", "150", "200", "250"],
            "correct": "C"
        },
        {
            "q": "8. The ratio of the ages of A and B is 4 : 5. After 5 years, the ratio becomes 5 : 6. What is A's present age?",
            "options": ["20 years", "25 years", "30 years", "35 years"],
            "correct": "A"
        },
        {
            "q": "9. A bag contains 4 red balls, 5 blue balls and 3 green balls. One ball is drawn at random. What is the probability that the ball drawn is neither red nor blue?",
            "options": ["1/12", "1/4", "1/3", "3/12"],
            "correct": "A"
        }
    ]

    for question in questions:
        # Title
        pdf.set_font('Arial', 'B', 12)
        pdf.multi_cell(0, 10, question["q"])
        
        # Options
        pdf.set_font('Arial', '', 12)
        labels = ['A', 'B', 'C', 'D']
        for i, opt in enumerate(question["options"]):
            pdf.cell(0, 8, f"{labels[i]}) {opt}", ln=1)
        
        # Answer
        pdf.ln(2)
        pdf.set_font('Arial', 'I', 11)
        pdf.cell(0, 10, f"Correct Option: {question['correct']}", ln=1)
        pdf.ln(5) # Space between questions

    output_path = "../frontend/public/tcs_questions.pdf"
    if not os.path.exists("../frontend/public"):
        os.makedirs("../frontend/public")
        
    pdf.output(output_path)
    print(f"PDF generated successfully at {output_path}")

if __name__ == "__main__":
    create_pdf()
