# 🔧 Git Commands Reference - Pet Care Platform

## 📋 Current Repository Status

```bash
Repository: Pet Care & Support Platform v1.0.0
Branch: main
Commits: 2
Status: ✅ All changes committed
```

## 🚀 Common Git Operations

### Check Repository Status
```bash
# View current status
git status

# View commit history
git log --oneline --graph

# View file changes
git diff

# View staged changes
git diff --cached
```

### Working with Changes
```bash
# Add all changes
git add .

# Add specific file
git add filename

# Commit changes
git commit -m "feat: your commit message"

# Commit with detailed message
git commit -m "feat: short description

Detailed explanation of changes made:
• First change
• Second change
• Third change"

# Amend last commit
git commit --amend -m "updated commit message"
```

### Branching
```bash
# Create new branch
git checkout -b feature/new-feature

# Switch branches
git checkout main
git checkout feature-branch

# List branches
git branch -a

# Delete branch (after merging)
git branch -d feature-branch
```

### Remote Operations
```bash
# Add remote repository
git remote add origin https://github.com/username/pet-care-platform.git

# Push to remote
git push -u origin main

# Pull from remote
git pull origin main

# View remotes
git remote -v
```

### Syncing and Updates
```bash
# Fetch latest from remote
git fetch origin

# Merge changes
git merge origin/main

# Rebase current branch
git rebase origin/main
```

## 🔄 Deployment Workflow

### Feature Development
```bash
# 1. Create feature branch
git checkout -b feature/user-notifications

# 2. Make changes and commit regularly
git add .
git commit -m "feat: add notification model"
git commit -m "feat: implement push notification service"
git commit -m "feat: add notification settings UI"

# 3. Push feature branch
git push origin feature/user-notifications

# 4. Create Pull Request on GitHub
# 5. After review, merge to main
git checkout main
git pull origin main
git branch -d feature/user-notifications
```

### Hotfix Workflow
```bash
# 1. Create hotfix from main
git checkout main
git checkout -b hotfix/security-patch

# 2. Fix the issue
git add .
git commit -m "fix: resolve authentication vulnerability"

# 3. Push and deploy immediately
git push origin hotfix/security-patch
# Deploy to production

# 4. Merge back to main
git checkout main
git merge hotfix/security-patch
git push origin main
```

### Release Workflow
```bash
# 1. Create release branch
git checkout -b release/v1.1.0

# 2. Update version numbers
# Edit package.json, version files, etc.
git add .
git commit -m "chore: bump version to 1.1.0"

# 3. Tag the release
git tag -a v1.1.0 -m "Release version 1.1.0

✨ New Features:
• Feature 1
• Feature 2

🐛 Bug Fixes:
• Fix 1
• Fix 2

🚀 Improvements:
• Performance boost
• UI enhancements"

# 4. Push release
git push origin release/v1.1.0
git push origin v1.1.0
```

## 📝 Commit Message Conventions

### Format
```
type(scope): short description

Longer description if needed:
• Point 1
• Point 2
• Point 3

Closes #123
```

### Types
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks
- `perf`: Performance improvements
- `ci`: CI/CD changes

### Examples
```bash
git commit -m "feat(auth): add JWT refresh token mechanism"
git commit -m "fix(pets): resolve profile image upload issue"
git commit -m "docs: update API endpoint documentation"
git commit -m "style(ui): improve mobile navigation layout"
git commit -m "refactor(db): optimize pet search queries"
git commit -m "test: add unit tests for health tracking"
git commit -m "chore: update dependencies to latest versions"
```

## 🔍 Useful Git Commands

### Viewing History
```bash
# Pretty log with graph
git log --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset'

# Show changes in last commit
git show

# Show changes in specific commit
git show commit-hash

# Search commit messages
git log --grep="search term"

# Show commits by author
git log --author="Author Name"
```

### Undoing Changes
```bash
# Unstage file
git reset HEAD filename

# Discard working directory changes
git checkout -- filename

# Reset to last commit (careful!)
git reset --hard HEAD

# Revert specific commit (safe)
git revert commit-hash
```

### Stashing Changes
```bash
# Stash current changes
git stash

# Stash with message
git stash push -m "work in progress on feature X"

# List stashes
git stash list

# Apply latest stash
git stash pop

# Apply specific stash
git stash apply stash@{1}
```

## 🚀 Setting Up Remote Repository

### GitHub Setup
1. **Create repository on GitHub**
   - Go to github.com
   - Click "New Repository"
   - Name: `pet-care-platform`
   - Description: "Comprehensive Pet Care & Support Platform for UK market"
   - Make it public or private as needed

2. **Connect local repository**
   ```bash
   git remote add origin https://github.com/yourusername/pet-care-platform.git
   git branch -M main
   git push -u origin main
   ```

3. **Verify connection**
   ```bash
   git remote -v
   # Should show origin with your GitHub URL
   ```

### Alternative Git Services
```bash
# GitLab
git remote add origin https://gitlab.com/username/pet-care-platform.git

# Bitbucket  
git remote add origin https://bitbucket.org/username/pet-care-platform.git

# Azure DevOps
git remote add origin https://dev.azure.com/organization/project/_git/pet-care-platform
```

## 🔐 SSH Key Setup (Recommended)

### Generate SSH Key
```bash
# Generate new SSH key
ssh-keygen -t ed25519 -C "your-email@example.com"

# Add to SSH agent
eval "$(ssh-agent -s)"
ssh-add ~/.ssh/id_ed25519

# Copy public key (Linux/Mac)
cat ~/.ssh/id_ed25519.pub
```

### Use SSH Remote
```bash
# Change remote to SSH
git remote set-url origin git@github.com:username/pet-care-platform.git
```

## 📊 Repository Statistics

```bash
# Count commits
git rev-list --count HEAD

# Count files
git ls-files | wc -l

# Repository size
du -sh .git

# Contributors
git shortlog -sn

# Lines of code by author
git log --format='%aN' | sort -u | while read name; do echo -en "$name\t"; git log --author="$name" --pretty=tformat: --numstat | awk '{ add += $1; subs += $2; loc += $1 - $2 } END { printf "added lines: %s, removed lines: %s, total lines: %s\n", add, subs, loc }' -; done
```

## 🎯 Current Project Structure in Git

```
pet-care-platform/
├── 📁 .git/                  # Git repository data
├── 📄 .gitignore            # Files to ignore
├── 📄 README.md             # Project documentation
├── 📄 CONTRIBUTING.md       # Contribution guidelines
├── 📄 DEPLOYMENT_CHECKLIST.md # Deployment guide
├── 📄 .env.example          # Environment template
├── 📄 package.json          # Backend dependencies
├── 📄 server.js             # Main server file
├── 📁 models/               # Database models
├── 📁 routes/               # API routes  
├── 📁 middleware/           # Express middleware
├── 📁 pwa/                  # Next.js PWA application
└── 📁 admin/                # Admin dashboard

All files tracked and committed! ✅
```

---

**Repository Status**: ✅ Ready for development and collaboration!
**Next Steps**: Push to GitHub and start collaborating! 🚀