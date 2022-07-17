
namespace lockdown_example
{
    partial class Main
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
            this.toggleLockdownBtn = new System.Windows.Forms.Button();
            this.SuspendLayout();
            // 
            // toggleLockdownBtn
            // 
            this.toggleLockdownBtn.FlatStyle = System.Windows.Forms.FlatStyle.Flat;
            this.toggleLockdownBtn.Font = new System.Drawing.Font("Segoe UI", 10F, System.Drawing.FontStyle.Regular, System.Drawing.GraphicsUnit.Point, ((byte)(0)));
            this.toggleLockdownBtn.Location = new System.Drawing.Point(175, 101);
            this.toggleLockdownBtn.Name = "toggleLockdownBtn";
            this.toggleLockdownBtn.Size = new System.Drawing.Size(135, 58);
            this.toggleLockdownBtn.TabIndex = 0;
            this.toggleLockdownBtn.Text = "Lockdown System";
            this.toggleLockdownBtn.UseVisualStyleBackColor = true;
            this.toggleLockdownBtn.Click += new System.EventHandler(this.toggleLockdownBtn_Click);
            // 
            // Main
            // 
            this.AutoScaleDimensions = new System.Drawing.SizeF(6F, 13F);
            this.AutoScaleMode = System.Windows.Forms.AutoScaleMode.Font;
            this.ClientSize = new System.Drawing.Size(484, 261);
            this.Controls.Add(this.toggleLockdownBtn);
            this.FormBorderStyle = System.Windows.Forms.FormBorderStyle.FixedSingle;
            this.Name = "Main";
            this.Text = "Lockdown Example";
            this.FormClosing += new System.Windows.Forms.FormClosingEventHandler(this.Main_FormClosing);
            this.ResumeLayout(false);

        }

        #endregion

        private System.Windows.Forms.Button toggleLockdownBtn;
    }
}

