
namespace digic
{
    partial class main
    {
        /// <summary>
        /// Required designer variable.
        /// </summary>
        private System.ComponentModel.IContainer components = null;

        /// <summary>
        /// Clean up any resources being used.
        /// </summary>
        /// <param name="disposing">true if managed resources should be disposed; otherwise, false.</param>
        protected override void Dispose(bool disposing)
        {
            if (disposing && (components != null))
            {
                components.Dispose();
            }
            base.Dispose(disposing);
        }

        #region Windows Form Designer generated code

        /// <summary>
        /// Required method for Designer support - do not modify
        /// the contents of this method with the code editor.
        /// </summary>
        private void InitializeComponent()
        {
            this.injectBtn = new System.Windows.Forms.Button();
            this.statusLbl = new System.Windows.Forms.Label();
            this.topmostCBox = new System.Windows.Forms.CheckBox();
            this.digiexamRBtn = new System.Windows.Forms.RadioButton();
            this.lockdownexRBtn = new System.Windows.Forms.RadioButton();
            this.SuspendLayout();
            // 
            // injectBtn
            // 
            this.injectBtn.BackColor = System.Drawing.SystemColors.MenuHighlight;
            this.injectBtn.FlatAppearance.BorderSize = 0;
            this.injectBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.injectBtn.Location = new System.Drawing.Point(45, 44);
            this.injectBtn.Name = "injectBtn";
            this.injectBtn.Size = new System.Drawing.Size(268, 52);
            this.injectBtn.TabIndex = 0;
            this.injectBtn.TabStop = false;
            this.injectBtn.Text = "Inject";
            this.injectBtn.UseVisualStyleBackColor = false;
            this.injectBtn.Click += new System.EventHandler(this.injectBtn_Click);
            // 
            // statusLbl
            // 
            this.statusLbl.AutoSize = true;
            this.statusLbl.Font = new System.Drawing.Font("Segoe UI", 9.75F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.statusLbl.Location = new System.Drawing.Point(12, 122);
            this.statusLbl.Name = "statusLbl";
            this.statusLbl.Size = new System.Drawing.Size(66, 17);
            this.statusLbl.TabIndex = 1;
            this.statusLbl.Text = "Status: Ok";
            // 
            // topmostCBox
            // 
            this.topmostCBox.AutoSize = true;
            this.topmostCBox.Location = new System.Drawing.Point(266, 122);
            this.topmostCBox.Name = "topmostCBox";
            this.topmostCBox.Size = new System.Drawing.Size(68, 17);
            this.topmostCBox.TabIndex = 2;
            this.topmostCBox.Text = "TopMost";
            this.topmostCBox.UseVisualStyleBackColor = true;
            this.topmostCBox.CheckedChanged += new System.EventHandler(this.topmostCBox_CheckedChanged);
            // 
            // digiexamRBtn
            // 
            this.digiexamRBtn.AutoSize = true;
            this.digiexamRBtn.Location = new System.Drawing.Point(12, 12);
            this.digiexamRBtn.Name = "digiexamRBtn";
            this.digiexamRBtn.Size = new System.Drawing.Size(68, 17);
            this.digiexamRBtn.TabIndex = 3;
            this.digiexamRBtn.TabStop = true;
            this.digiexamRBtn.Text = "Digiexam";
            this.digiexamRBtn.UseVisualStyleBackColor = true;
            // 
            // lockdownexRBtn
            // 
            this.lockdownexRBtn.AutoSize = true;
            this.lockdownexRBtn.Checked = true;
            this.lockdownexRBtn.Location = new System.Drawing.Point(226, 12);
            this.lockdownexRBtn.Name = "lockdownexRBtn";
            this.lockdownexRBtn.Size = new System.Drawing.Size(118, 17);
            this.lockdownexRBtn.TabIndex = 4;
            this.lockdownexRBtn.TabStop = true;
            this.lockdownexRBtn.Text = "Lockdown-Example";
            this.lockdownexRBtn.UseVisualStyleBackColor = true;
            // 
            // main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.BackColor = System.Drawing.SystemColors.Control;
            this.ClientSize = new System.Drawing.Size(358, 148);
            this.Controls.Add(this.lockdownexRBtn);
            this.Controls.Add(this.digiexamRBtn);
            this.Controls.Add(this.topmostCBox);
            this.Controls.Add(this.statusLbl);
            this.Controls.Add(this.injectBtn);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.MaximizeBox = false;
            this.Name = "main";
            this.Text = "Digic";
            this.Load += new System.EventHandler(this.main_Load);
            this.ResumeLayout(false);
            this.PerformLayout();

        }

        #endregion

        private System.Windows.Forms.Button injectBtn;
        private System.Windows.Forms.Label statusLbl;
        private System.Windows.Forms.CheckBox topmostCBox;
        private System.Windows.Forms.RadioButton digiexamRBtn;
        private System.Windows.Forms.RadioButton lockdownexRBtn;
    }
}

