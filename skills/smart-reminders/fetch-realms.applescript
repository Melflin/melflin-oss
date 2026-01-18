-- AppleScript to fetch reminders in chunks
-- Saves to temp file for faster execution

on run argv
    set startIndex to item 1 of argv as integer
    set chunkSize to item 2 of argv as integer
    
    tell application "Reminders"
        set output to ""
        set counter to 0
        set totalCount to count of every reminder
        
        repeat with r in every reminder
            set counter to counter + 1
            if counter > startIndex and counter <= (startIndex + chunkSize) then
                try
                    set remID to id of r
                    set remName to name of r
                    set remBody to body of r
                    set remDue to due date of r
                    set remComp to completed of r
                    set remList to name of container of r
                    set output to output & remID & "|||" & remName & "|||" & remBody & "|||" & (remDue as text) & "|||" & (remComp as text) & "|||" & remList & "|||;;;|||"
                end try
            end if
        end repeat
        
        return output
    end tell
end run
