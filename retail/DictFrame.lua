DictResult = {}

-- close frame by esc
tinsert(UISpecialFrames, DictFrame:GetName())
tinsert(UISpecialFrames, DictLogFrame:GetName())

DictFrame:RegisterEvent("ADDON_LOADED")
DictFrame:SetScript("OnEvent", function(self, event, arg1)
  if event == "ADDON_LOADED" and arg1 == "ssdict" then
    for i = 1, table.getn(DictKeys) do
      local button = CreateFrame("button","DictFrameTab"..i, DictFrame, "DictFrameTabTemplate")
      button:SetID(i)
      button:SetText(DictKeys[i])
      if i == 1 then
        button:SetPoint("BOTTOMLEFT", -2, -30)
      else
        button:SetPoint("BOTTOMLEFT", "DictFrameTab"..(i-1), "BOTTOMRIGHT")
      end
      button:SetScript("OnShow", function(self)
        self:SetWidth(0);
        PanelTemplates_TabResize(self, i, nil);
      end)
    end

    DictFrame.numTabs = table.getn(DictKeys);
    if DictFrame_LastSelectedTab == nil then
      PanelTemplates_SetTab(DictFrame, 1);
    else 
      PanelTemplates_SetTab(DictFrame, DictFrame_LastSelectedTab);
    end
  end
end)

function DictFrame_LookUp(word, shouldLog)
  if DictLog == nil then
    DictLog = {}
  end

  DictResult = {}
  local hasResult = false
  for k, v in pairs(DictSource) do
    if v["data"] then
      DictResult[k] = nil
      for i = 1, table.getn(v["data"]) do
        if (v["data"][i][word]) then
          DictResult[k] = v["data"][i][word]
          hasResult = true
          break
        end
      end
    end
  end

  if hasResult then
    DictFrameWord:SetText(word);
    if shouldLog then 
      AddToDictLog(word)
    end
    DictFrame_Update()
  end
end

function DictFrame_Update()
  local result;

  local dictKey = DictKeys[DictFrame.selectedTab];
  DictFrame_LastSelectedTab = DictFrame.selectedTab;

  result = DictResult[dictKey];

  DictScrollFrame:SetVerticalScroll(0);

  if (result) then
    DictFramePronounciation:SetText(result["pron"]);
    DictFrameDefinition:SetText(result["def"]);
    DictFrameSource:SetText(DictSource[dictKey]["source"]);
  else 
    DictFramePronounciation:SetText("");
    DictFrameDefinition:SetText(DictSource[dictKey]["noResultText"]);
    DictFrameSource:SetText("");
  end

  ShowUIPanel(DictFrame)
  ShowUIPanel(DictScrollChildFrame)

  local pronHeight = DictFramePronounciation:GetStringHeight()
  DictFrameDefinition:SetPoint("TOPLEFT", 20, -(pronHeight + 20))

  local definitionHeight = DictFrameDefinition:GetStringHeight()
  DictFrameSource:SetPoint("TOPLEFT", 20, -(pronHeight + 20 + definitionHeight + 60))
end

SLASH_LOOKUP1 = "/d"
SLASH_LOOKUP2 = "/dict"
SlashCmdList["LOOKUP"] = function(msg)
  DictFrame_LookUp(msg, true);
end 

function AddToDictLog(msg)
  local currentDate = date("%Y%m%d%H%M%S")
  local currentLog = nil;
  for k, v in ipairs(DictLog) do
    if (v and v[1] == msg) then
      currentLog = v;
      DictLog[k] = false;
      break
    end
  end
  if currentLog then
    table.insert(DictLog, { msg, currentLog[2] + 1, currentDate })
  else
    table.insert(DictLog, { msg, 1, currentDate })
  end
end

-- SLASH_DICTEXPORT1 = "/dictexport"
-- SlashCmdList["DICTEXPORT"] = function(msg)
--   print("Log:")
--   -- print(table.concat(DictLog,", "))
--   ShowUIPanel(DictExportFrame)

--   -- DictExportEditBox:SetText(table.concat(DictLog,", "))
--   DictExportEditBox:HighlightText()

--   print("DictExportEditBox:", DictExportEditBox)
-- end