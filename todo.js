const todoAddBtn = document.querySelector(".todo-add");
      const todoInput = document.querySelector(".todo-input");
      const todoArray = document.querySelector(".todo-array");
      const themeToggle = document.querySelector(".theme-toggle");
      let allTodo = JSON.parse(localStorage.getItem("item")) || [];

      function renderingTodo() {
        if (allTodo.length === 0) {
          todoArray.innerHTML = `
            <div class="empty-state">
              <i class="fas fa-clipboard-list"></i>
              <h3>No tasks yet</h3>
              <p>Add a new task to get started!</p>
            </div>
          `;
          return;
        }

        let todoDisplayHTML = "";

        allTodo.forEach((item, index) => {
          const isComplete = item.complete === "yes";
          const textDecoration = isComplete ? "line-through" : "none";
          const isChecked = isComplete ? "checked" : "";
          const todoClass = isComplete ? "todo-item todo-complete" : "todo-item";
          
          todoDisplayHTML += `
            <div class="${todoClass}">
              <input type="checkbox" class="completionTick" ${isChecked} data-index="${index}">
              <p class="todo-name" style="text-decoration: ${textDecoration}">${item.name}</p>
              <button class="updateBtn"><i class="fas fa-edit"></i> Update</button>
              <button class="delete-todo"><i class="fas fa-trash"></i> Delete</button>
            </div>`;
        });
        todoArray.innerHTML = todoDisplayHTML;

        document.querySelectorAll(".completionTick").forEach((item,index) => {
          if(item.checked) {
            let allBtn = document.querySelectorAll(".updateBtn")
            allBtn[index].style.display = "none"
            saveToStorage()
          }
        })

        //update
        document.querySelectorAll(".updateBtn").forEach((updateItem,index) => {
          updateItem.addEventListener("click",() => {
            let todoElements = document.querySelectorAll(".todo-name")
            let value = todoElements[index].textContent
            let encodedValue = encodeURIComponent(value)
            window.location.href = `update.html?message=${encodedValue}&index=${index}`
          })
        })

        const urlParams = new URLSearchParams(window.location.search)
        const updatedMessage = urlParams.get("updatedMessage")
        const updateIndex = urlParams.get("updatedIndex")

        if(updatedMessage && updatedMessage !== null) {
          allTodo[updateIndex].name = decodeURIComponent(updatedMessage)
          history.replaceState(null,'',location.pathname)
          saveToStorage()
          renderingTodo()
        }

        //delete
        document.querySelectorAll(".delete-todo").forEach((delItem, index) => {
          delItem.addEventListener("click", () => {
            allTodo.splice(index, 1);
            saveToStorage();
            renderingTodo();
          });
        });

        //completion
        document.querySelectorAll(".completionTick").forEach((tick, index) => {
          tick.addEventListener("click", () => {
            if (allTodo[index].complete === "yes") {
              allTodo[index].complete = "no";
            } else {
              allTodo[index].complete = "yes";
            }

            saveToStorage();
            renderingTodo();
          });
        });
      }

      function saveToStorage() {
        localStorage.setItem("item", JSON.stringify(allTodo));
      }

      // adding
      todoAddBtn.addEventListener("click", () => {
        let eachTodo = todoInput.value.trim();
        if (eachTodo) {
          let allObj = { name: eachTodo, complete: "no" };
          allTodo.push(allObj);
          todoInput.value = "";
          saveToStorage();
          renderingTodo();
        }
      });

      todoInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          todoAddBtn.click();
        }
      });

      //theme
      let currentTheme = localStorage.getItem("todoTheme") || "light";
      if (currentTheme === "dark") {
        document.body.classList.add("dark-theme");
        themeToggle.innerHTML = '<i class="fas fa-sun"></i> Theme';
      }

      themeToggle.addEventListener("click", () => {
        document.body.classList.toggle("dark-theme");
        if (document.body.classList.contains("dark-theme")) {
          currentTheme = "dark";
          themeToggle.innerHTML = '<i class="fas fa-sun"></i> Theme';
        } else {
          currentTheme = "light";
          themeToggle.innerHTML = '<i class="fas fa-moon"></i> Theme';
        }
        localStorage.setItem("todoTheme", currentTheme);
      });

      renderingTodo();