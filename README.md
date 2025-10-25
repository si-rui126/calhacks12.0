## Getting started
How to run the app in its development state. First, make sure you're in the root folder of your project.

### Frontend:
Navigate the ```client``` side of your project!
```bash
cd client
```

Generally good practice to run before starting the frontend, in case any changes have been made since you last pulled.
```bash
npm install
```

After you run ```npm install```, run 
```bash
npm run dev
```

You should see this following pop up in your console:
```bash
> calhacks-project@0.0.0 dev
> vite


  VITE v7.1.12  ready in 963 ms

  ➜  Local:   http://localhost:5173/    
  ➜  Network: use --host to expose      
  ➜  press h + enter to show help 
```

### Backend

**Activating the virtual environment**
In order for all the dependencies to run, we need the virtual environment to be updated. (KIND of similar to a npm install). Make sure you're in the root directory!
```bash
.venv/scripts/activate
```

Now, you should see (.venv) at the beginning of your file path. (Ex: ```(.venv) PS C:\Users\maria\OneDrive\Desktop\my_projects\calhacks\server>```

In a separate terminal, navigate to the backend using
```bash
cd server
```

You should be able to run the backend using
```bash
python main.py
```

You should see the following in your console:
```bash
* Serving Flask app 'main'
 * Debug mode: off
WARNING: This is a development server. Do not use it in a production deployment. Use a production WSGI server instead.
 * Running on http://127.0.0.1:8080
Press CTRL+C to quit
```

Now navigate to [this link](http://localhost:5173/) to see the app. It should be running in your local web browser!!


