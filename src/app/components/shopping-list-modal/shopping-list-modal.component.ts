import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController } from '@ionic/angular';
import jsPDF from 'jspdf';

@Component({
  selector: 'app-shopping-list-modal',
  standalone: true,
  imports: [CommonModule, IonicModule],
  templateUrl: './shopping-list-modal.component.html',
  styleUrls: ['./shopping-list-modal.component.scss'],
})
export class ShoppingListModalComponent {
  @Input() title!: string;
  @Input() ingredients: string[] = [];

  constructor(private modalCtrl: ModalController) {}

  dismiss() {
    this.modalCtrl.dismiss();
  }

  // Exports the ingredients as a downloadable PDF 
  exportToPDF() {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text(`Shopping List: ${this.title}`, 10, 10);

    // Adds bullet points to each ingredient for nicer look
    this.ingredients.forEach((item, index) => {
      doc.text(`- ${item}`, 10, 20 + index * 10);
    });

    // Save file using the meal title in the filename
    doc.save(`${this.title.replace(/\s+/g, '_')}_Shopping_List.pdf`);
  }
}
