# Digiexam-HackedVersion
![sus](https://miro.medium.com/max/700/0*1q9o3DXVRpk9siIH.gif)

Once you press inject, it injects the .dll file into the Digiexam process, which makes it a part of it. Therefore it will not be shut down by Digiexam. Then it executes processes as SYSTEM so Digiexam can't close them. 

## Remember: This is purely for educational purposes and don't use it to cheat. 

### To use it with digiexam:
- Open digiexam and prepare to start the exam, but **dont do it** yet. 
- Start the digic.exe and select Digiexam in top left corner.
- Press inject
- If successful, there should now be a terminal window that appeared. This window is now a part of digiexam.
- If "Get Window Handles" returns SUCCESS you can start the exam. Else press CTRL+ALT+R to try to regenerate. If no success, restart digiexam and try again.

### To try it on the lockdown example (lockdown-example.exe):
- Start lockdown example
- Open digic.exe and select Lockdown example
- Press Inject
- The terminal window should now appear
- Now you can press lockdown system (Note: This will shutdown all applications and become fullscreen, to mimic the behaviour of digiexam)
- Press alt-tab to bring the window to the foreground. Here you can see all keybinds, try them. The "Start A Webbrowser" might not work, if not, press CTRL+ALT+C to open cmd. Then open your browser from there "%LocalAppData%\Google\Chrome\Application\chrome.exe"

![image](https://user-images.githubusercontent.com/68228472/164036653-ba04069e-43c8-4aa4-9167-db41c438c777.png)
![image](https://user-images.githubusercontent.com/68228472/164036716-3f667ce2-340c-4a7b-8fd5-128497d39e17.png)

If you want to have some notes, you can put them in `C:/notes/notes.txt`. Can later be opened with CTRL+ALT+N


## If you want to compile yourself
- Make sure that PsExec is placed inside a folder called `bin` in the same directory as digic.exe file.
- Make sure that digic.exe and the .dll file is in the same directory, and that the .dll file is named `digic-dll.dll`

\
If you want to read about how I did this, check out [This post](https://medium.com/@rwcx0x/digiexam-is-not-cheat-proof-and-here-is-why-2b2d0146a55e)
```
I don't recommend you to cheat since that is not good, I just made this for educational purposes.
I take no responsibility for what you do with this.

The images, resources & everything is owned by DigiExam Solutions Sweden AB
```
